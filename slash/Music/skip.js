const config = require('../../config/config.json');

module.exports = {
        name: 'skip',
        description: 'Skip the song.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (player.queue.size < 1) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip.error4', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                await player.stop();

                const embed = {
                        description: client.lang.__({ phrase: 'skip.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}