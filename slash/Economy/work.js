const cooldown = new Set();
const model = require('../../models/economy.js');
const config = require('../../config/config.json');

module.exports = {
        name: 'work',
        description: 'Work and get money.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                if (cooldown.has(interaction.user.id)) {
                        const error = {
                                description: client.lang.__({ phrase: 'work.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

		cooldown.add(interaction.user.id);
		
                const earned = Math.floor(Math.random() * (500 - 100)) + 100;

                model.findOne({
                        User: interaction.user.id
                }, async (err, data) => {
                        if (err) throw err;

                        if (data) {
                                data.Wallet += earned;
                                data.save();
                        } else {
                                await new model({
                                        User: interaction.user.id,
                                        Wallet: earned,
                                        Bank: 0
                                }).save();
                        }

                        const embed = {
                                description: client.lang.__mf({ phrase: 'work.embed', locale: lang }, { earned: earned }),
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                });

		setTimeout(() => {
			cooldown.delete(interaction.user.id)
		}, 300000);
        }
}