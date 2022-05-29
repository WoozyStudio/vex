const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'with-draw',
        description: 'Withdraw money from the bank.',
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
                await interaction.deferReply().catch(() => {});
                const amount = interaction.options.getInteger('amount');

                model.findOne({
                        User: interaction.user.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                if (amount > data.Bank) {
                                        const error = {
                                                description: '❌ You don\'t have that money in the bank.',
                                                color: config.embedError
                                        }
                                        
                                        return interaction.followUp({
                                                embeds: [ error ]
                                        });
                                }

                                data.Wallet += amount;
                                data.Bank -= amount;
                                data.save();

                                const embed = {
                                        description: 'You have withdrawn :coin: `' + amount + '` from the bank.',
                                        color: config.embedColor
                                }

                                interaction.followUp({
                                        embeds: [ embed ]
                                });
                        } else {
                                const error2 = {
                                        description: '❌ You don\'t have a balance.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error2 ]
                                });
                        }
                });
        }
}