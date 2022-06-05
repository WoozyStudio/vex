const config = require('../../config/config.json');

module.exports = {
        name: 'loop',
        description: 'Enables/Disables the song loop.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'loop.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'loop.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'loop.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (player.trackRepeat === true) {
                        player.setTrackRepeat(false);

                        const embed = {
                                description: client.lang.__({ phrase: 'loop.embed', locale: lang }),
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                } else {
                        player.setTrackRepeat(true);

                        const embed = {
                                description: client.lang.__({ phrase: 'loop.embed2', locale: lang }),
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                }
        }
}