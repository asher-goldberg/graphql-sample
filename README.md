# Introduction

This is a sample project designed to provide a working example of a GraphQL server that
returns results from a REST datasource of Real Estate data, as well as provides the ability
to store and increment a "favorite count" for a given property.

Properties can be filtered by city as well.

# Getting Started

You will need `node.js` (LTS) and `yarn` already installed.

1. copy the `.env.template` file to `.env` and fill in the fields as needed.
2. Run `yarn install` to install all dependencies required for the project.
3. Run `yarn start:db` to start the Mongo in memory server and add some sample users.
4. Run `yarn start:app` to run the application and listen for queries on the `/graphql` route.
5. Once the app is running you can hit the endpoint and run the samples queries below.

**note**: You will need to provide a bearer token in your request for authorization purposes
```
curl -H "Authorization: token {token}" http://localhost:4000/graphql
```

## Unit Tests

To run the unit tests for the project run `yarn test`.

## Query Examples

### Query to retrieve data from the RETS API as well as the favorite count

This query takes an optional `city` parameter.  Omit for a list of all properties.

```
query {
  properties(city: "Houston") {
    listingId,
    favoriteCount,
    listPrice,
    property {
      area,
      bedrooms,
    },
    address {
        city
    },
    disclaimer
  }
}
```

### Mutation to increment favorite count for a listing

Requires `listingId`.

```
mutation IncrementFavoriteCounter($listingId: String!) {
  incrementFavoriteCounter(listingId: $listingId) {
    listingId,
    favoriteCount
  }
}
```

The full example of the mutation query in a curl request with the authorization token looks like this:
```
curl --location --request POST 'http://localhost:4000/graphql' \
--header 'Authorization: token {token}' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation IncrementFavoriteCounter($listingId: String!) {\r\n  incrementFavoriteCounter(listingId: $listingId) {\r\n    listingId,\r\n    favoriteCount\r\n  }\r\n}","variables":{"listingId":"59437738"}}'
```
# General Thoughts and Coding Decisions

- I used the `apollo-datasource-rest` and `apollo-datasource-mongodb` packages to make the 
querying easier from the respective datasources.  In theory this could have been implemented
without those, but those helper packages have some very quick and easy methods for getting
this going.
- Ideally there should be a full integration test that can run the queries against the graph endpoint.
- With more time, there should be better error handling and more defensive code.