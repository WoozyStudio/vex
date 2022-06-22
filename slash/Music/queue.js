const pretty = require('pretty-ms');
const config = require('../../config/config.json');

module.exports = {
        name: 'queue',
        description: 'Displays the song queue.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'queue.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const queue = player.queue;
                const tracks = queue.slice(0, 10);

                var map = tracks.map((track, i) => {
                        return `<:emoji_1:987398741780750426> \`${i + 1}.\` [${track.title}](${track.uri}) [${pretty(track.duration)}] • \`${track.requester}\`.`;
                }).join('\n');

                if (!map) {
                        map = client.lang.__({ phrase: 'queue.error2', locale: lang });
                }

                var icon = interaction.guild.iconURL();

                if (!icon) {
                        icon = client.user.avatarURL();
                }

                const embed = {
                        thumbnail: {
                                url: icon
                        },
                        author: {
                                name: queue.current.title + '.',
                                icon_url: client.user.avatarURL(),
                                url: queue.current.uri
                        },
                        description: map,
                        color: config.embedColor,
                        timestamp: new Date()
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}