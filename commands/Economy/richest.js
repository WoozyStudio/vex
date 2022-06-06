const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'richest',
        description: 'Displays the richest users.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                model.find({}, (err, data) => {
                        if (err) throw err;

                        const lb = data.sort((a, b) => Number((b.Wallet + b.Bank) - (a.Wallet + a.Bank)));
                        const total = lb.slice(0, 10);

                        var map = total.map((user, index) => {
                                const username = client.users.cache.get(user.User);
                                return client.lang.__mf({ phrase: 'richest.embed', locale: lang }, { index: index + 1, user: username.tag, wallet: user.Wallet, bank: user.Bank })
                        }).join('\n');

                        if (!map) {
                                map = client.lang.__({ phrase: 'richest.error', locale: lang });
                        }

                        const embed = {
                                thumbnail: {
                                        url: client.user.avatarURL()
                                },
                                fields: [
                                        {
                                                name: client.lang.__({ phrase: 'richest.embedField', locale: lang }),
                                                value: map
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