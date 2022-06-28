const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'pay',
        description: 'Pay money to a user.',
        options: [
                {
                        name: 'user',
                        description: '-',
                        type: 'USER',
                        required: true
                },
                {
                        name: 'amount',
                        description: '-',
                        type: 'INTEGER',
                        required: true,
                        minValue: 1
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
                const user = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');

                if (user.id === client.user.id || user.bot) {
                        interaction.followUp({
                                content: client.lang.__(
					{ 
						phrase: 'pay.error', 
						locale: lang 
					}
				)
                        });
			return;
                }

                if (user.id === interaction.user.id) {
                        interaction.followUp({
                                content: client.lang.__(
					{
						phrase: 'pay.error2',
						locale: lang 
					}
				)
                        });
			return;
                }

                model.findOne({
                        User: interaction.user.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                if (amount > data.Wallet) {
                                        interaction.followUp({
                                                content: client.lang.__(
							{ 
								phrase: 'pay.error3', 
								locale: lang 
							}
						)
                                        });
					return;
                                }

                                data.Wallet -= amount;
                                data.save();

                                model.findOne({
                                        User: user.id
                                }, async (err, data2) => {
                                        if (err) throw err;

                                        if (data2) {
                                                data2.Wallet += amount;
                                                data2.save();
                                        } else {
                                                await new model({
                                                        User: user.id,
                                                        Wallet: amount,
                                                        Bank: 0
                                                }).save();
                                        }

                                        interaction.followUp({
						content: client.lang.__mf(
							{
								phrase: 'pay.embed', 
								locale: lang 
							}, 
							{
								amount: amount, 
								user: user.tag 
							}
						)
                                        });
                                });
                        } else {
                                interaction.followUp({
					content: client.lang.__(
						{
							phrase: 'pay.error4', 
							locale: lang 
						}
					)
                                });
				return;
                        }
                });
        }
}