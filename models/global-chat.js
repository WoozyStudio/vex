const mongo = require('mongoose');

const schema = new mongo.Schema({
        Guild: {
                type: mongo.SchemaTypes.String
        },
        Channel: {
                type: mongo.SchemaTypes.String
        }
});

module.exports = mongo.model('global-chat', schema);