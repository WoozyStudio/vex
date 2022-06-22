const lyrics = require('lyrics-finder');
const config = require('../../config/config.json');

module.exports = {
	name: 'lyrics',
	description: 'Displays the lyrics of a song.',
	options: [
		{
			name: 'song',
			description: '-',
			type: 'STRING'
		}
	],
	type: 'CHAT_INPUT',
	run: async (client, interaction) => {
		await interaction.deferReply().catch(() => { });
		const lang = interaction.member.guild.lang;
		var song = interaction.options.getString('song');

		if (song) {
			await lyrics(song).then((res) => {
				const embed = {
					thumbnail: {
						url: client.user.avatarURL()
					},
					author: {
						name: client.user.tag,
						icon_url: client.user.avatarURL()
					},
					description: res,
					color: config.embedColor,
					timestamp: new Date()
				}

				interaction.followUp({
					embeds: [embed]
				});
			}).catch(() => {
				const error = {
					description: client.lang.__({ phrase: 'lyrics.error2', locale: lang }),
					color: config.embedError
				}

				return interaction.followUp({
					embeds: [error]
				});
			});
		} else {
			const player = client.player.get(interaction.guild.id);
			
			if (!player) {
				const error = {
					description: client.lang.__({ phrase: 'lyrics.error', locale: lang }),
					color: config.embedError
				}

				return interaction.followUp({
					embeds: [error]
				});
			}

			const current = player.queue.current;
			
			await lyrics(current.title).then((res) => {
				const embed = {
					thumbnail: {
						url: client.user.avatarURL()
					},
					author: {
						name: client.user.tag,
						icon_url: client.user.avatarURL()
					},
					description: res,
					color: config.embedColor,
					timestamp: new Date()
				}

				interaction.followUp({
					embeds: [embed]
				});
			}).catch(() => {
				const error = {
					description: client.lang.__({ phrase: 'lyrics.error2', locale: lang }),
					color: config.embedError
				}

				return interaction.followUp({
					embeds: [error]
				});
			});
		}
	}
}