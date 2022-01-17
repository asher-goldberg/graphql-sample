const express = require('express');
const app = express();

const MongoDBConnection = require('./db/mongo');
const ListingsCollection = MongoDBConnection.client.db().collection('listings');

const checkAuth = require('./middleware/checkAuthMiddleware');

// GraphQL Imports for Apollo Configuration
const types = require('./graphql/types')
const resolvers = require ('./graphql/resolvers')
const PropertiesAPI = require('./datasources/properties');
const Listings = require('./datasources/listings');
const { ApolloServer } = require('apollo-server-express');

// Build settings object for Apollo Server
let apolloSettings = {
    typeDefs: [types],
    resolvers: resolvers,
    dataSources: () => {
        return {
            propertiesAPI: new PropertiesAPI(),
            listings: new Listings(ListingsCollection)
        };
    }
};

async function startServer() {
    const server = new ApolloServer(apolloSettings);

    // Make sure database is started
    await MongoDBConnection.connect();

    // Then start everything else
    await server.start();

    // Tell Apollo to use the /graphql route
    server.applyMiddleware({ app, path:"/graphql" });
}

startServer();

app.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
);

// Define middleware on specific routes for authentication purposes
app.use('/graphql', function (req, res, next) {
    checkAuth(req)
        .then((auth) => {
            if (!auth) {
                return res.status(401).send('You must provide a valid bearer token to use this endpoint');
            }

            // If auth is valid continue through the stack
             return next();
        });
})