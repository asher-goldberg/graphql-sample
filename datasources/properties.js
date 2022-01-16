const { RESTDataSource } = require('apollo-datasource-rest');
const config = require ('../config');

const { api: { base_url, username, secret }} = config;

module.exports = class PropertiesAPI extends RESTDataSource {
    constructor() {
        // Make sure we are properly setting the context
        super();

        // Set properties for the API connection
        this.baseURL = base_url;

        // In theory this is where we'd implement some HTTP level caching
        // so we aren't fetching the same properties data over and over
    }

    async willSendRequest(request) {
        // Attach the basic auth creds to the API request
        request.headers.set('Authorization', 'Basic ' + Buffer.from(username + ':' + secret).toString('base64'));
    }

    async getProperties(filter) {
        let path = '/properties';
        // If a filter param is provided we attach it to the request with the query param
        // "q" defined in the SimplyRETS docs.
        if (filter.city) {
            path = `/properties?q=${encodeURIComponent(filter.city)}`;
        }

        let results = await this.get(path);
        return results;
    }
}