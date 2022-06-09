/*const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'balance',
        description: 'Displays the user\'s balance.',
        run: async (client, message) => {
                const lang = message.member.guild.lang;
                const user = message.mentions.users.first() || message.author;

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
                                description: client.lang.__mf({ phrase: 'balance.embed', locale: lang }, { user: user.id }),
                                fields: [
                                        {
                                                name: client.lang.__({ phrase: 'balance.embedField', locale: lang }),
                                                value: client.lang.__mf({ phrase: 'balance.embedFieldValue', locale: lang }, { wallet: wallet, bank: bank })
                                        }
                                ],
                                color: config.embedColor,
                                timestamp: new Date()
                        }

                        message.reply({
                                embeds: [embed]
                        });
                });
        }
}*/