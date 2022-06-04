const mongo = require('mongoose');

const schema = new mongo.Schema({
        Guild: {
                type: mongo.SchemaTypes.String
        },
        Language: {
                type: mongo.SchemaTypes.String
        }
});

module.exports = mongo.model('language', schema);