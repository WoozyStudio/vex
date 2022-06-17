const client = require('../../bot.js');
const model = require('../../models/global-chat.js');
const config = require('../../config/config.json');

client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        model.findOne({
                Channel: message.channel.id,
                Enabled: true
        }, (err, data) => {
                if (err) throw err;

                if (data) {
                        model.find({
                                Enabled: true
                        }, (err, data) => {
                                if (data.Language === 'es') {
                                        data.map(({ Channel }) => {
                                                const embed = {
                                                        description: message.content
                                                }

                                                client.channels.cache.get(Channel).send({
                                                        embeds: [embed]
                                                }).catch((err) => { });
                                        });
                                }

                                if (data.Language === 'en') {
                                        data.map(({ Channel }) => {
                                                const embed = {
                                                        description: message.content
                                                }

                                                client.channels.cache.get(Channel).send({
                                                        embeds: [embed]
                                                }).catch((err) => { });
                                        });
                                }
                        });

                }
        });
});