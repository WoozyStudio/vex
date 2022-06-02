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
                const user = interaction.options.getUser('user');
                const amount = interaction.options.getInteger('amount');

                if (user.id === client.user.id || user.bot) {
                        const error = {
                                description: '❌ You cannot use this command with a bot.',
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (user.id === interaction.user.id) {
                        const error = {
                                description: '❌ You cannot use this command with you.',
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                model.findOne({
                        User: interaction.user.id
                }, (err, data) => {
                        if (err) throw err;

                        if (data) {
                                if (amount > data.Wallet) {
                                        const error = {
                                                description: '❌ You don\'t have that money in your wallet.',
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
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

                                        const embed = {
                                                description: 'You have paid :coin: `' + amount + '` to <@' + user.id + '>.',
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                });
                        } else {
                                const error = {
                                        description: '❌ You don\'t have a balance',
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }
                });
        }
}