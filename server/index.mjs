import express from "express";

import {ApolloServer} from "apollo-server-express";
import {resolvers} from './resolvers.mjs';
import {typeDefs} from './schemas.mjs';

const server = new ApolloServer({typeDefs, resolvers});

server.start().then(() => {
    server.applyMiddleware({app});
})

const app = express();

app.listen({port : 4000}, () =>
    console.log(`Server ready at http://locahost:4000${server.graphqlPath}`)
);