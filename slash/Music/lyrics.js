const lyrics = require('lyrics-finder');
const config = require('../../config/config.json');

module.exports = {
	name: 'lyrics',
	description: 'Displays the lyrics of a song.',
	options: [
		{
			name: 'song',
			description: '-',
			type: 'STRING',
			required: true
		}
	],
	type: 'CHAT_INPUT',
	run: async (client, interaction) => {
		await interaction.deferReply().catch(() => { });
		const lang = interaction.member.guild.lang;
		var song = interaction.options.getString('song');

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

			if (embed.description.length > 4000) {
                                embed.description = embed.description.substr(0, 3997) + '...'
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