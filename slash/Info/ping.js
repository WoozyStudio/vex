const config = require('../../config/config.json')

module.exports = {
        name: 'ping',
        description: 'Displays the latency of the bot.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

		const value = {
			high: 200,
			medium: 100,
			low: 50
		}
		
		const latency = Date.now() - interaction.createdTimestamp;
		var circle;

		if (latency > value.high) {
			circle = '🔴'; 
		} else if (latency > value.medium) {
			circle = '🟡';
		} else {
			circle = '🟢';
		}

		const embed = {
			description: client.lang.__mf({ phrase: 'ping.embed', locale: lang }, { circle: circle, latency: latency, api: client.ws.ping }),
			color: config.embedColor
		}

		interaction.followUp({
			embeds: [embed]
		});
	}
}