const resolvers = {
    Query: {
        properties: async (_, filter, { dataSources }) => {
            // Get the base set of results from the API
            let properties = await dataSources.propertiesAPI.getProperties(filter);

            // Need to loop through the properties to attach the favorite count
            // from the other datasource.  TODO: optimize to only run once, not
            // for each property in the loop.
            let propertiesWithFavorite = properties.map((property) => {
                let favoriteCount = dataSources.listings.getFavoriteCount(property.listingId);

                property.favoriteCount = favoriteCount;
                return property;
            })

            return propertiesWithFavorite;           
        },
    },
    Mutation: {
        incrementFavoriteCounter: async (_, args, { dataSources }) => {
            let id = args.listingId;
            return dataSources.listings.incrementFavoriteCount(id);
        }
    },
}

module.exports = resolvers;