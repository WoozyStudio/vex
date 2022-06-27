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
                                        return interaction.followUp({
						content: client.lang.__(
							{ 
								phrase: 'deposit.error', 
								locale: lang 
							}
						)
                                        });
                                }

                                data.Bank += amount;
                                data.Wallet -= amount;
                                data.save();

                                interaction.followUp({
                                        content: client.lang.__mf(
						{ 
							phrase: 'deposit.embed', 
							locale: lang 
						}, 
						{
							amount: amount 
						}
					)
                                });
                        } else {
                                return interaction.followUp({
                                        content: client.lang.__(
						{ 
							phrase: 'deposit.error2', 
							locale: lang 
						}
					)
                                });
                        }
                });
        }
}