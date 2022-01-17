const checkAuth = require ('../../middleware/checkAuthMiddleware');
const {MongoClient} = require ('mongodb');

describe('Test User Authentication', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect('mongodb://localhost:27017');
        db = await connection.db('properties');
    })

    it('should return 401 if no token is included in the headers', async () => {
        const req = { headers: {} };

        let authValid = await checkAuth(req);

        expect(authValid).toBe(false);
    }),

    afterAll(async () => {
        await connection.close();
    })
})