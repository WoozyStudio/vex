const config = require('../../config/config.json');

module.exports = {
        name: 'volume',
        description: 'Sets the volume of the song.',
        options: [
                {
                        name: 'integer',
                        description: '-',
                        type: 'INTEGER',
                        required: true,
                        minValue: 0,
                        maxValue: 500
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const integer = interaction.options.getInteger('integer');

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: '❌ You have to be on a voice channel.',
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: '❌ You have to be on the same voice channel.',
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: '❌ There is nothing playing now.',
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                await player.setVolume(integer);

                const embed = {
                        description: 'The volume was set at `' + integer + '%`.',
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}