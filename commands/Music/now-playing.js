const format = require('../../structures/formatDuration');
const config = require('../../config/config.json');

module.exports = {
        name: 'now-playing',
        description: 'Displays the currently playing song.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});
                
                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: '❌ There is nothing playing now.',
                                color: config.embedError
                        }
                        
                        return interaction.followUp({
                                embeds: [ error ]
                        });
                }

                const song = player.queue.current;

                const embed = {
                        thumbnail: {
                                url: 'https://img.youtube.com/vi/' + song.identifier + '/hqdefault.jpg'
                        },
                        description: '[' + song.title + '](' + song.uri + ').',
                        fields: [
                                {
                                        name: 'Information:',
                                        value: '👤 Author: `' + song.author + '`.\n⏰ Duration: `' + format(player.position) + ' / ' + format(song.duration) + '`.'
                                }
                        ],
                        color: config.embedColor,
                        timestamp: new Date()
                }

                interaction.followUp({
                        embeds: [ embed ]
                });
        }
}