const MongoDBConnection = require('../db/mongo');
const UsersCollection = MongoDBConnection.client.db().collection('users');

module.exports = async function checkAuth(req) {
    // Grab the token from the request headers
    let token = (req.headers.authorization || '').split('token ')[1] || '';
    
    if (token === '') {
        return false;
    }

    let isValid = false;

    await UsersCollection.findOne({ token: token })
        .then((user) => {
            if (user != null) {
                isValid = true;
            }
        })

    return isValid;
}