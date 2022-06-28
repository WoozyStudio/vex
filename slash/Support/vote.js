const config = require('../../config/config.json');

module.exports = {
        name: 'vote',
        description: 'Vote for the bot.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const embed = {
                        thumbnail: {
                                url: client.user.avatarURL()
                        },
                        author: {
                                name: client.user.tag,
                                icon_url: client.user.avatarURL()
                        },
                        description: client.lang.__(
				{
					phrase: 'vote.embed', 
					locale: lang 
				}
			),
                        color: config.embedColor,
                        timestamp: new Date()
                }

                interaction.followUp({
                        embeds: [
				embed
			]
                });
        }
}