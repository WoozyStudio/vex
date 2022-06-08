const quick = require('quick.db');
const ms = require('ms');
const pretty = require('pretty-ms');
const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'work',
        description: 'Work to get money.',
        run: async (client, message, args) => {
                const lang = message.member.guild.lang;

                const time = quick.fetch('workTimer_' + message.author.id);

                if (Date.now() < time) {
                        const rest = time - Date.now();
                        const format = pretty(rest, {
                                verbose: true,
                                compact: true
                        });

                        const error = {
                                description: 'Error ' + client.lang.__mf({ phrase: 'work.error', locale: lang }, { format: format }),
                                color: config.embedError
                        }

                        return message.reply({
                                embeds: [error]
                        });
                }

                const earned = Math.floor(Math.random() * (500 - 100)) + 100;

                model.findOne({
                        User: message.author.id
                }, async (err, data) => {
                        if (err) throw err;

                        if (data) {
                                data.Wallet += earned;
                                data.save();
                        } else {
                                await new model({
                                        User: message.author.id,
                                        Wallet: earned,
                                        Bank: 0
                                }).save();
                        }

                        const embed = {
                                description: 'Work ' + client.lang.__mf({ phrase: 'work.embed', locale: lang }, { earned: earned }),
                                color: config.embedColor
                        }

                        message.reply({
                                embeds: [embed]
                        });

                        const msTime = ms('5m');

                        quick.delete('workTimer_' + message.author.id);
                        quick.add('workTimer_' + message.author.id, Date.now() + msTime);
                });
        }
}