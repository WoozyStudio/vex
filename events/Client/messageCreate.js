const client = require('../../bot.js');
const model = require('../../models/global-chat.js');
const config = require('../../config/config.json');

client.on('messageCreate', async (message) => {
        client.guilds.cache.forEach((server) => {
                model.find({
                        Guild: server.id
                }, (err, data) => {
                        if (data) {
                                client.channels.cache.get(data.Channel).send(message.content);
                        }
                });
        });
});