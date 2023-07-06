import express from "express";

import passport from "passport";
import { buildContext } from "graphql-passport";

import session from "express-session";
import { v4 as uuid } from "uuid";

import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers.mjs";
import { typeDefs } from "./schemas.mjs";
import UserController from "./controllers/UserController.js";

import cors from "cors";
import bodyParser from "body-parser";
import { ExtractJwt } from "passport-jwt";

import jwt from "jsonwebtoken";
import AuthenticationStrategies from "./strategies/AuthenticationStrategies.mjs";

passport.use(AuthenticationStrategies.getLocalStrategy());

passport.use(
  AuthenticationStrategies.getJWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  })
);

passport.use(AuthenticationStrategies.getGoogleStrategy());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return buildContext({ req, res });
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });
});

passport.serializeUser((user, done) => {
  done(null, { iduser: user.iduser, mail: user.mail });
});

passport.deserializeUser(async (user, done) => {
  const users = await UserController.get(user.iduser);
  done(null, users);
});

const app = express();

app.use(bodyParser.json());

app.use(
  session({
    genid: (req) => uuid(),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(cors());

app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Origin: *"
  );
  next();
});

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://locahost:4000${server.graphqlPath}`)
);

app.post("/login", passport.authenticate("local"), (req, res) => {
  const isRefreshToken = req.body.remember;
  req.login(
    { mail: req.body.mail, password: req.body.password },
    async (err) => {
      if (err) {
        res.send({ type: "error", message: "Error logging in" });
        return next(err);
      }
      UserController.getMail(req.body.mail).then(async (user) => {
        const token = UserController.genAuthToken({
          id: user.iduser,
          mail: user.mail,
        });
        if (isRefreshToken) {
          const refreshToken = await UserController.getRefreshToken(
            user.iduser
          );
          console.log(refreshToken);
          res.send({
            type: "success",
            message: "Logged in",
            token: token,
            refreshToken: refreshToken,
            mail: user.mail,
          });
        } else {
          res.send({
            type: "success",
            message: "Logged in",
            token: token,
            mail: user.mail,
          });
        }
      });
    }
  );
});

app.get("/login/google", passport.authenticate("google"));

app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/login/success",
    failureRedirect: "/login/failure",
    failureMessage: true,
  })
);

app.get("/login/success", async (req, res) => {
  console.log(req.user);
  const token = UserController.genAuthToken({
    id: req.user.iduser,
    mail: req.user.mail,
  });

  const verified = await UserController.checkNonce(req.user.iduser) ? "true" : "false";
  
  res.redirect(`${process.env.CLIENT_URL}/?mailVerified=${verified}&token=${token}&refreshToken=${req.user.refreshToken}&mail=${req.user.mail}`);
});

app.get("/login/failure", (req, res) => {
  res.send({ type: "error", message: "Error logging in" });
});

app.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        res.send("Error logging out");
        return next(err);
      }
      res.send("Logged out");
    });
  }
);

app.post("/signup", (req, res, next) => {
  UserController.checkIfUserExists(req.body.mail).then((exists) => {
    if (exists) {
      res.send({ type: "Error", message: "User already exists" });
      return next("User already exists");
    } else {
      UserController.create(req.body.mail, req.body.password).then((user) => {
        req.login({ mail: user.mail, password: user.password }, (err) => {
          if (err) {
            res.send({ type: "Error", message: "Error logging in" });
            return next(err);
          }
          const token = UserController.genAuthToken({
            id: user.iduser,
            mail: user.mail,
          });
          res.send({
            type: "Success",
            message: "Logged in",
            token: token,
            refreshToken: user.getRefreshToken(),
            mail: user.mail,
          });
        });
      });
    }
  });
});

app.post(
  "/mail/confirm",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    UserController.sendConfirmationMail(decoded.id, req.body.firstname).then(
      (status) => {
        if (status) {
          res.send({ type: "Success", message: "Mail sent" });
        } else {
          res.send({ type: "Error", message: "Error sending mail" });
        }
      }
    );
  }
);

app.post(
  "/mail/code",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    UserController.confirm(decoded.mail, req.body.nonce).then((status) => {
      if (status) {
        res.send({ type: "Success", message: "Mail confirmed" });
      } else {
        res.send({
          type: "Error",
          message: "Error confirming mail : bad nonce",
        });
      }
    });
  }
);

/**
 * @api {post} /user/refresh Refresh token
 * @apiName RefreshToken
 * @apiGroup User
 * @apiDescription Refresh the token of the user
 * @apiParam {String} token Token of the user and the mail
 * Uses the refresh token to generate a new token but before that verfies the refresh token
 */
app.post(
  "/user/refresh",
  UserController.getRefreshTokenStrategy,
  async (req, res) => {
    const refreshToken = await UserController.updateRefreshToken(
      req.body.token
    );
    console.log(refreshToken);
    const user = await UserController.getMail(req.body.mail);
    const accessToken = UserController.genAuthToken({
      id: user.iduser,
      mail: req.body.mail,
    });
    res.send({ refreshToken: refreshToken, accessToken: accessToken });
  }
);
