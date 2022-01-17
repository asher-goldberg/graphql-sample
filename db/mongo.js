const MongoClient = require('mongodb').MongoClient;
const config = require ('../config');

class MongoDBConnection {
    constructor() {
        const { db: { name, port, host }} = config;
        const url = `mongodb://${host}:${port}/${name}`;

        this.client = new MongoClient(url);
    }

    async connect() {
        await this.client.connect()
            .catch(() => {
                throw new Error('Error connecting to MongoDB');
            });
    
        console.log('Successfully connected to MongoDB');

        this.db = this.client.db();
    }
}

module.exports = new MongoDBConnection();