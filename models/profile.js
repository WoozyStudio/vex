const mongo = require('mongoose');

const schema = new mongo.Schema({
        User: {
                type: mongo.SchemaTypes.String
        },
        AboutMe: {
                type: mongo.SchemaTypes.String
        },
        Followers: {
                type: mongo.SchemaTypes.Array
        },
        Avatar: {
                type: mongo.SchemaTypes.String
        },
        Badges: {
                type: mongo.SchemaTypes.Array
        }
});

module.exports = mongo.model('profile', schema);