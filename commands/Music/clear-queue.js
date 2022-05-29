const config = require('../../config/config.json');

module.exports = {
        name: 'clear-queue',
        description: 'Clears the queue.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});
                
                if (!interaction.member.voice.channel) {
                        const error = {
                                description: '❌ You have to be on a voice channel.',
                                color: config.embedError
                        }
                        
                        return interaction.followUp({
                                embeds: [ error ]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: '❌ You have to be on the same voice channel.',
                                color: config.embedError
                        }
                        
                        return interaction.followUp({
                                embeds: [ error ]
                        });
                }
                
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
                
                if (player.queue.size < 1) {
                        const error = {
                                description: '❌ The queue has no more songs.',
                                color: config.embedError
                        }
                        
                        return interaction.followUp({
                                embeds: [ error ]
                        });
                }
                
                await player.queue.clear();

                const embed = {
                        description: 'The queue was cleared.',
                        color: config.embedColor
                }
                
                interaction.followUp({
                        embeds: [ embed ]
                });
        }
}