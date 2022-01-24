const resolvers = {
    Query: {
        properties: async (_, filter, { dataSources }) => {
            // Get the base set of results from the API
            let properties = await dataSources.propertiesAPI.getProperties(filter);

            // Map all property IDs to retrieve favorites from Listing DS
            let propertyIDs = properties.map((property) => {
                return property.listingId;
            });

            let favorites = await dataSources.listings.getFavoriteCounts(propertyIDs);
            let favoritesById = [];

            // Parse favorites from Listing Datasource into KV array
            favorites.forEach((favorite) => {
                favoritesById[`${favorite.listingId}`] = favorite.favoriteCount;
            })

            // Need to loop through the properties to attach the favorite count
            let propertiesWithFavorite = properties.map((property) => {
                let favoriteCount = favoritesById[`${property.listingId}`] ?? 0;

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