const mongo = require('mongoose');

const schema = new mongo.Schema({
        Guild: {
                type: mongo.SchemaTypes.String
        },
        Channel: {
                type: mongo.SchemaTypes.String
        },
        Enabled: {
                type: mongo.SchemaTypes.Boolean
        }
});

module.exports = mongo.model('global-chat', schema);