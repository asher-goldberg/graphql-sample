const express = require('express');
const app = express();

const checkAuth = require('./middleware/checkAuthMiddleware');

// GraphQL Imports for Apollo Configuration
const types = require('./graphql/types')
const resolvers = require ('./graphql/resolvers')
const PropertiesAPI = require('./datasources/properties');
const Listings = require('./datasources/listings');
const { ApolloServer } = require('apollo-server-express');

// Store settings for Apollo Server
let apolloSettings = {
    typeDefs: [types],
    resolvers: resolvers.resolvers,
    dataSources: () => {
        return {
            propertiesAPI: new PropertiesAPI(),
            listings: new Listings(resolvers.listingsCollection)
        };
    }
};

async function startServer() {
    const server = new ApolloServer(apolloSettings);

    await server.start();

    server.applyMiddleware({ app, path:"/graphql" });
}

startServer();

app.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
);

// Define middleware on specific routes for authentication purposes
app.use('/graphql', function (req, res, next) {
    let isAuthValid = checkAuth(req);

    if (!isAuthValid) {
        return res.status(401).send('You must provide a bearer token to use this endpoint');
    }
    
    // If auth is valid continue through the stack
    return next();
})