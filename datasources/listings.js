const { MongoDataSource } = require ('apollo-datasource-mongodb');

module.exports = class Listings extends MongoDataSource {
    async getFavoriteCounts(listingIDs) {
        let favorites = await this.findByFields({ listingId: listingIDs });

        return favorites;
    }

    async getFavoriteCount(id) {
        let listing = await this.findByFields({listingId: id})
            .then(result => {
                return result;
            });

        if (listing === undefined || listing.length == 0) {
            return 0;
        }
            
        return listing[0].favoriteCount;
    }

    async incrementFavoriteCount(id) {
        // find the existing document in DB for this listing
        let listing = await this.findByFields({listingId: id})
            .then(result => {
                return result;
            });

        let newCount = 0;

        // If there's no existing favorite counter for this listing we just start a record at 1
        if (listing === undefined || listing.length == 0) {
            newCount = 1;
        } else {
            newCount = listing[0].favoriteCount + 1;
        }

        await this.collection.updateOne(
            { listingId: id },
            {
                $set: { favoriteCount: newCount }
            },
            {
                // Upsert will ensure the new favorite documents get added if it's
                // the first time somethng is being favorited
                upsert: true
            }
        );

        return {
            listingId: id,
            favoriteCount: newCount
        };
    }
}