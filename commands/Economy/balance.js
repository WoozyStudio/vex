const { MessageEmbed } = require('discord.js');
const model = require('../../models/economy.js');
const config = require('../../config/config.json');
const emoji = require('../../config/emojis.json');

module.exports = {
        name: 'balance',
        description: 'Displays the user\'s balance..',
        options: [
                {
                        name: 'user',
                        description: '-',
                        type: 'USER',
                        required: false
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});
                const user = interaction.options.getUser('user') || interaction.user;

                model.findOne({
                        User: user.id
                }, (err, data) => {
                        if (err) throw err;

                        const wallet = data ? data.Wallet : 0;
                        const bank = data ? data.Bank : 0;

                        const embed = {
                                thumbnail: {
                                        url: user.avatarURL({ dynamic: true })
                                },
                                description: '<@' + user.id + '> balance:',
                                fields: [
                                        {
                                                name: '💵 Wallet:',
                                                value: '> :coin: `' + wallet + '`.',
                                                inline: true
                                        },
                                        {
                                                name: '🏦 Bank:',
                                                value: '> :coin: `' + bank + '`.',
                                                inline: true
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