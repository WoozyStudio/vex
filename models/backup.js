const mongo = require('mongoose');

const schema = new mongo.Schema({
        User: {
                type: mongo.SchemaTypes.String
        },
        Id: {
                type: mongo.SchemaTypes.String
        },
        GuildName: {
                type: mongo.SchemaTypes.String
        }
});

module.exports = mongo.model('backup', schema);