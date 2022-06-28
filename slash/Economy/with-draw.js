const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'with-draw',
        description: 'Withdraws money from the bank.',
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
                                if (amount > data.Bank) {
                                        interaction.followUp({
                                                content: client.lang.__(
							{
								phrase: 'with-draw.error', 
								locale: lang 
							}
						)
                                        });
					return;
                                }

                                data.Wallet += amount;
                                data.Bank -= amount;
                                data.save();

                                interaction.followUp({
					content: client.lang.__mf(
						{
							phrase: 'with-draw.embed', 
							locale: lang 
						}, 
						{
							amount: amount 
						}
					)
                                });
                        } else {
                                interaction.followUp({
					content: client.lang.__(
						{
							phrase: 'with-draw.error2',
							locale: lang 
						}
					)
                                });
				return;
                        }
                });
        }
}