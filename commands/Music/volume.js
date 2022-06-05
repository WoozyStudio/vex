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
                const lang = interaction.member.guild.lang;
                const integer = interaction.options.getInteger('integer');

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'volume.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'volume.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'volume.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                await player.setVolume(integer);

                const embed = {
                        description: client.lang.__({ phrase: 'volume.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}