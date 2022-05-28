const { MessageEmbed } = require('discord.js');
const model = require('../../models/economy.js');
const config = require('../../config/config.json');
const emoji = require('../../config/emojis.json');

module.exports = {
        name: 'rich',
        description: 'Displays the richest users.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});

                model.find({}, (err, data) => {
                        if (err) throw err;

                        const lb = data.sort((a, b) => Number((b.Wallet + b.Bank) - (a.Wallet + a.Bank)));
                        const total = lb.slice(0, 10);
                        var map = total.map((user, index) => {
                                return `> \`${index + 1}.\` <@${user.User}>. 💵 Wallet: :coin: \`${user.Wallet}\` - 🏦 Bank: :coin: \`${user.Bank}\`.`;
                        }).join('\n');

                        if (!map) {
                                map = '❌ There are no users.';
                        }

                        const embed = {
                                thumbnail: {
                                        url: client.user.avatarURL()
                                },
                                description: 'List of richest users.',
                                fields: [
                                        {
                                                name: '👑 Leaderboard:',
                                                value: map
                                        }
                                ],
                                color: config.embedColor,
                                timestamp: new Date()
                        }

                        interaction.followUp({
                                embeds: [ embed ]
                        });
                });
        }
}