const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'deposit',
        description: 'Deposit money in the bank.',
        options: [
                {
                        name: 'amount',
                        description: '-',
                        type: 'INTEGER',
                        minValue: 1,
                        required: true
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
                const amount = interaction.options.getInteger('amount');

                model.findOne({
                        User: interaction.user.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                if (amount > data.Wallet) {
                                        const error = {
                                                description: client.lang.__({ phrase: 'deposit.error', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }

                                data.Bank += amount;
                                data.Wallet -= amount;
                                data.save();

                                const embed = {
                                        description: client.lang.__mf({ phrase: 'deposit.embed', locale: lang }, { amount: amount }),
                                        color: config.embedColor
                                }

                                interaction.followUp({
                                        embeds: [embed]
                                });
                        } else {
                                const error = {
                                        description: client.lang.__({ phrase: 'deposit.error2', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }
                });
        }
}