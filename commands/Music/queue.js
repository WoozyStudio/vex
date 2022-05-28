const { MessageEmbed } = require('discord.js');
const config = require('../../config/config.json');
const emoji = require('../../config/emojis.json');

module.exports = {
        name: 'queue',
        description: 'Displays the queue of songs.',
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

                const queue = player.queue;
                const tracks = queue.slice(0, 10);
                var map = tracks.map((track, i) => {
                        return `> \`${i + 1}.\` [${track.title}](${track.uri}).`;
                }).join('\n');

                if (!map) {
                        map = '> ❌ There are no songs.';
                }
                
                var icon = interaction.guild.iconURL();

                if (!icon) {
                        icon = client.user.avatarURL();
                }

                const embed = {
                        thumbnail: {
                                url: icon
                        },
                        description: '[' + queue.current.title + '](' + queue.current.uri + ').',
                        fields: [
                                {
                                        name: '📋 Queue:',
                                        value: map
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