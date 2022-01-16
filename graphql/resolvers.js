const { MongoClient } = require ('mongodb');
const client = new MongoClient('mongodb://localhost:27017/properties')
client.connect()
const ListingsCollection = client.db().collection('listings');

const resolvers = {
    Query: {
        properties: async (_, filter, { dataSources }) => {
            let properties = await dataSources.propertiesAPI.getProperties(filter);

            return properties;           
        },
    },
    Listing: {
        favoriteCount: async (root, args, { dataSources }) => {
            let favoriteCount = await dataSources.listings.getFavoriteCount(root.listingId);

            return favoriteCount;
        }
    },
    Mutation: {
        incrementFavoriteCounter: async (_, args, { dataSources }) => {
            let id = args.listingId;
            return dataSources.listings.incrementFavoriteCount(ListingsCollection, id);
        }
    }
}

module.exports = {
    resolvers: resolvers,
    listingsCollection: ListingsCollection
};