const MongoClient = require('mongodb').MongoClient;
const config = require ('../config');

const { db: { name, port, host }} = config;

const url = `mongodb://${host}:${port}/${name}`;

const client = new MongoClient(url);