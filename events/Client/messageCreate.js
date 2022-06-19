const client = require('../../bot.js');
const model = require('../../models/global-chat.js');
const model2 = require('../../models/profile.js');
const Filter = require('bad-words');
const filter = new Filter({
        replaceRegex: /[A-Za-z0-9가-힣_]/g,
        placeHolder: '#'
});
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
                                                        message.delete().catch((err) => {});

                                                        const regExp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

                                                        const filteredText = filter.clean(message.content);
                                                        const response = filteredText.replace(regExp, '*The message was marked as spam.*');
                                                        
                                                        const embed = {
                                                                thumbnail: {
                                                                        url: message.author.avatarURL({ dynamic: true })
                                                                },
                                                                author: {
                                                                        name: message.author.tag,
                                                                        icon_url: message.author.avatarURL({ dynamic: true })
                                                                },
                                                                description: response,
                                                                fields: [
                                                                        {
                                                                                name: 'Information:',
                                                                                value: '<:emoji_1:987398741780750426> Server: `' + message.guild.name + '`.\n<:emoji_1:987398741780750426> Profile ID: `' + data2._id+ '`.\n<:emoji_1:987398741780750426> Vex badges: ' + data2.Badges
                                                                        }
                                                                ],
                                                                timestamp: new Date()
                                                        }

                                                        if (regExp.test(message.content) === true) {
                                                                embed.color = config.embedError;
                                                        } else {
                                                                embed.color = config.embedColor;
                                                        }

                                                        if (embed.description.length > 4000) {
                                                                embed.description = embed.description.substr(0, 3997) + '...'
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