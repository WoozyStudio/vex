const mongo = require('mongoose');

const schema = new mongo.Schema({
        User: {
                type: mongo.SchemaTypes.String
        },
        Wallet: {
                type: mongo.SchemaTypes.Number
        },
        Bank: {
                type: mongo.SchemaTypes.Number
        }
});

module.exports = mongo.model('economy', schema);