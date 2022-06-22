const pretty = require('pretty-ms');
const config = require('../../config/config.json');

module.exports = {
        name: 'now-playing',
        description: 'Displays the currently playing song.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'now-playing.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const song = player.queue.current;
		const formatted = pretty(song.duration, {
			compact: true
		});
		
                const embed = {
                        description: client.lang.__mf({ phrase: 'now-playing.embed', locale: lang }, { title: song.title, uri: song.uri, duration: formatted, requester: song.requester }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}