const quick = require('quick.db');
const ms = require('ms');
const pretty = require('pretty-ms');
const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'work',
        description: 'Work to get money.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const time = quick.fetch('workTimer_' + interaction.user.id);

                if (Date.now() < time) {
                        const rest = time - Date.now();
                        const format = pretty(rest, {
                                verbose: true,
                                compact: true
                        });

                        const error = {
                                description: client.lang.__mf({ phrase: 'work.error', locale: lang }, { format: format }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const earned = Math.floor(Math.random() * (500 - 100)) + 100;

                model.findOne({
                        User: interaction.user.id
                }, async (err, data) => {
                        if (err) throw err;

                        if (data) {
                                data.Wallet += earned;
                                data.save();
                        } else {
                                await new model({
                                        User: interaction.user.id,
                                        Wallet: earned,
                                        Bank: 0
                                }).save();
                        }

                        const embed = {
                                description: client.lang.__mf({ phrase: 'work.embed', locale: lang }, { earned: earned }),
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });

                        const msTime = ms('5m');

                        quick.delete('workTimer_' + interaction.user.id);
                        quick.add('workTimer_' + interaction.user.id, Date.now() + msTime);
                });
        }
}