const model = require('../../models/language.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'set-language',
        description: 'Set the bot language.',
        options: [
                {
                        name: 'lang',
                        description: '-',
                        choices: [
                                {
                                        name: '🇺🇲 English (EN).',
                                        value: 'en'
                                },
                                {
                                        name: '🇪🇦 Español (ES).',
                                        value: 'es'
                                }
                        ],
                        type: 'STRING',
                        required: true
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply({ ephemeral: false }).catch(() => { });
                const lang = interaction.member.guild.lang
                const language = interaction.options.getString('lang');

                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                        const error = {
                                description: client.lang.__mf({ phrase: 'set-language.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                model.findOne({
                        Guild: interaction.guild.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                data.Language = language;
                                data.save();
                        } else {
                                new model({
                                        Guild: interaction.guild.id,
                                        Language: language
                                }).save();
                        }

                        const embed = {
                                description: 'The language was changed.',
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                });
        }
}