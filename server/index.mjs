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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => buildContext({req, res}),
});

passport.use(UserController.getLocalStrategy());

server.start().then(() => {
    server.applyMiddleware({app});
})

passport.serializeUser((user, done) => {
    done(null, {id: user.iduser, mail: user.mail});
});

passport.deserializeUser((id, done) => {
    const users = UserController.get(id);
    done(null, users);
});

const app = express();

app.use(session({
    genid: (req) => uuid(),
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(cors());

app.listen({port: 4000}, () =>
    console.log(`Server ready at http://locahost:4000${server.graphqlPath}`)
);

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    res.send("Logged in");
});

app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.send("Error logging out");
            return next(err);
        }
        res.send("Logged out");
    })
})

app.post('/signup', (req, res, next) => {

    UserController.create(req.query.mail, req.query.password).then((user) => {
        const userExpress = {
            id: user.iduser,
            mail: user.mail
        };

        console.log("User express: " + JSON.stringify(userExpress));

        req.login(userExpress, (err) => {
            if (err) {
                res.send("Error logging in");
                return next(err);
            }
            res.send("Logged in");
        });
    });
});