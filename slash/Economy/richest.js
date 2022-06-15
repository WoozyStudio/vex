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
                                var username = client.users.cache.get(user.User).tag 
                                        
                                if (!username) { 
                                        username = 'Unknown User#0000'; 
                                }
                                
                                return client.lang.__mf({ phrase: 'richest.embed', locale: lang }, { index: index + 1, user: username, wallet: user.Wallet, bank: user.Bank })
                        }).join('\n');

                        if (!map) {
                                map = client.lang.__({ phrase: 'richest.error', locale: lang });
                        }

                        const embed = {
                                thumbnail: {
                                        url: client.user.avatarURL()
                                },
                                author: {
                                        name: client.user.tag,
                                        icon_url: client.user.avatarURL()
                                },
                                description: map,
                                color: config.embedColor,
                                timestamp: new Date()
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                });
        }
}