const client = require('../../bot.js');
const model = require('../../models/global-chat.js');
const model2 = require('../../models/profile.js');
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
                                if (err) throw err;

                                model2.findOne({
                                        User: message.author.id
                                }, (err, data2) => {
                                        if (err) throw err;
                                        
                                        if (data2) {
                                                data.map(({ Channel }) => {
                                                        const embed = {
                                                                thumbnail: {
                                                                        url: message.author.avatarURL({ dynamic: true })
                                                                },
                                                                author: {
                                                                        name: message.author.tag,
                                                                        icon_url: message.author.avatarURL({ dynamic: true })
                                                                },
                                                                description: message.content,
                                                                fields: [
                                                                        {
                                                                                name: 'Information',
                                                                                value: '➤ Badges: ' + data.Badges
                                                                        }
                                                                ],
                                                                color: config.embedColor
                                                        }

                                                        client.channels.cache.get(Channel).send({
                                                                embeds: [embed]
                                                        }).catch((err) => { });
                                                });
                                        } else {
                                                const error = {
                                                        description: '❌ You don\'t have a profile.',
                                                        color: config.embedError
                                                }

                                                message.channel.send({
                                                        embeds: [error]
                                                });
                                        }
                                });
                        });
                }
        });
});