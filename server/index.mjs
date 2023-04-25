import express from "express";

import passport from "passport";
import {buildContext} from "graphql-passport";


import session from "express-session";
import {v4 as uuid} from "uuid";

import dotenv from 'dotenv';

dotenv.config();

import {ApolloServer} from "apollo-server-express";
import {resolvers} from './resolvers.mjs';
import {typeDefs} from './schemas.mjs';
import UserController from "./UserController.js";

import cors from "cors";
import bodyParser from "body-parser";
import {ExtractJwt} from "passport-jwt";


passport.use(UserController.getLocalStrategy());

passport.use(UserController.getJWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}));


const server = new ApolloServer({
    typeDefs, resolvers, context: ({req, res}) => {
        return buildContext({req, res});
    }
});


server.start().then(() => {
    server.applyMiddleware({app});
})

passport.serializeUser((user, done) => {
    done(null, {mail: user.iduser, password: user.mail});
});

passport.deserializeUser((id, done) => {
    const users = UserController.get(id);
    done(null, users);
});

const app = express();

app.use(bodyParser.json());

app.use(session({
    genid: (req) => uuid(), secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(cors({
    credentials: true,
}));


app.listen({port: 4000}, () => console.log(`Server ready at http://locahost:4000${server.graphqlPath}`));

app.post('/login', passport.authenticate('local'), (req, res) => {
    req.login({mail: req.body.mail, password: req.body.password}, async (err) => {
        if (err) {
            res.send({type: "error", message: "Error logging in"});
            return next(err);
        }
        UserController.getMail(req.body.mail).then((user) => {
            const token = UserController.genJWT({id: user.iduser, mail: user.mail});
            res.send({type: "success", message: "Logged in", token: token, mail: user.mail});
        });
    });
});

app.post('/logout', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.send("Error logging out");
            return next(err);
        }
        res.send("Logged out");
    })
});

app.post('/signup', (req, res, next) => {
    UserController.checkIfUserExists(req.body.mail).then((exists) => {
        if (exists) {
            res.send({type: "error", message: "User already exists"});
            return next('User already exists');
        } else {
            UserController.create(req.body.mail, req.body.password).then((user) => {
                const userExpress = {
                    id: user.iduser, mail: user.mail
                };

                req.login(userExpress, (err) => {
                    if (err) {
                        res.send({type: "error", message: "Error logging in"});
                        return next(err);
                    }
                    const token = UserController.genJWT({id: user.iduser, mail: user.mail});
                    res.send({type: "success", message: "Logged in", token: token});
                });
            });
        }
    });

});

