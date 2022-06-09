const model = require('../../models/language.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'set-language',
        description: 'Set the bot language.',
        run: async (client, message, args) => {
                const lang = message.member.guild.lang;

                if (!message.member.permissions.has('ADMINISTRATOR')) {
                        const error = {
                                description: client.lang.__({ phrase: 'set-language.error', locale: lang }),
                                color: config.embedError
                        }

                        return message.reply({
                                embeds: [error]
                        });
                }

                if (!args[0]) {
                        const embed = {
                                fields: [
                                        {
                                                name: client.lang.__({ phrase: 'set-language.message.embedField', locale: lang }),
                                                value: client.lang.__({ phrase: 'set-language.message.embedFieldValue', locale: lang })
                                        }
                                ],
                                color: config.embedColor
                        }

                        return message.reply({
                                embeds: [embed]
                        });
                }

                const langs = ['en', 'es'];

                if (!langs.includes(args[0])) {
                        const error = {
                                description: client.lang.__({ phrase: 'set-language.message.error', locale: lang }),
                                color: config.embedColor
                        }

                        return message.reply({
                                embeds: [error]
                        });
                }

                model.findOne({
                        Guild: message.guild.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                data.Language = args[0].toLowerCase();
                                data.save();
                        } else {
                                new model({
                                        Guild: message.guild.id,
                                        Language: args[0].toLowerCase()
                                }).save();
                        }

                        const embed = {
                                description: client.lang.__({ phrase: 'set-language.embed', locale: lang }),
                                color: config.embedColor
                        }

                        message.reply({
                                embeds: [embed]
                        });
                });
        }
}