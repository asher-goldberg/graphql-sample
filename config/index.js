require('dotenv').config();

const config = {
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME
    },
    api: {
        base_url: process.env.API_BASE_URL,
        username: process.env.API_USER,
        secret: process.env.API_SECRET
    }
};

module.exports = config;