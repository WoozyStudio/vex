const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'balance',
        description: 'Displays the user\'s balance.',
        options: [
                {
                        name: 'user',
                        description: '-',
                        type: 'USER'
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
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
                                author: {
                                        name: user.tag,
                                        icon_url: user.avatarURL({ dynamic: true })
                                },
                                fields: [
                                        {
                                                name: client.lang.__({ phrase: 'balance.embedField', locale: lang }),
                                                value: client.lang.__mf({ phrase: 'balance.embedFieldValue', locale: lang }, { wallet: wallet, bank: bank })
                                        }
                                ],
                                color: config.embedColor,
                                timestamp: new Date()
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                });
        }
}