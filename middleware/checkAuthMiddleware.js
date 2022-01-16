const { MongoClient } = require ('mongodb');
const client = new MongoClient('mongodb://localhost:27017/properties')
client.connect()
const UsersCollection = client.db().collection('users');

async function isUserTokenValid(token) {
    await UsersCollection
        .findOne({ token: token })
        .then((user) => {
            if (user == null) {
                return false;
            }

            return true;
        });
}

module.exports = function checkAuth(req) {
    // Grab the token from the request headers
    let token = (req.headers.authorization || '').split('Token ')[1] || '';
    
    if (token === '') {
        return false;
    }



    return isUserTokenValid(token)
        .then((result) => {
            console.log(result);
            if (!result) {
                
                return false;
            }

            return true;
        });
}