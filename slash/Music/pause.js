const config = require('../../config/config.json');

module.exports = {
        name: 'pause',
        description: 'Pause the song.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'pause.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'pause.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'pause.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (player.paused) {
                        const error = {
                                description: client.lang.__({ phrase: 'pause.error4', locale: lang }),
                                color: config.embedError
                        }

                        interaction.followUp({
                                embeds: [error]
                        });
                } else {
                        await player.pause(true);

                        const embed = {
                                description: client.lang.__({ phrase: 'pause.embed', locale: lang }),
                                color: config.embedColor
                        }

                        interaction.followUp({
                                embeds: [embed]
                        });
                }
        }
}