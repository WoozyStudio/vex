const { inspect } = require('util');
const config = require('../../config/config.json');

module.exports = {
        name: 'eval',
        description: 'Evaluate something with the bot (Bot administrators only).',
        options: [
                {
                        name: 'text',
                        description: '-',
                        type: 'STRING',
                        required: true
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply({ ephemeral: false }).catch(() => { });
		const lang = interaction.member.guild.lang;
                const text = interaction.options.getString('text');

                if (interaction.user.id !== '945029734943821824') {
                        const error = {
                                description: client.lang.__({ phrase: 'eval.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                try {
                        const result = eval(text);
                        var output = result;

                        if (typeof result !== 'string') {
                                output = inspect(result);
                        }

                        const embed = {
				thumbnail: {
					url: client.user.avatarURL()
				},
				author: {
					name: client.user.tag,
					icon_url: client.user.avatarURL()
				},
                                description: '```js\n' + output + '```',
                                color: config.embedColor,
                                timestamp: new Date()
                        }

                        if (embed.description.length >= 4090) {
                                embed.description = embed.description.substr(0, 4080) + '...```'
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                } catch (err) {
                        const error = {
				thumbnail: {
					url: client.user.avatarURL()
				},
				author: {
					name: client.user.tag,
					icon_url: client.user.avatarURL()
				},
                                description: '```js\n' + err.message + '```',
                                color: config.embedColor,
                                timestamp: new Date()
			}

                        interaction.followUp({
                                embeds: [error]
                        });
                }
        }
}