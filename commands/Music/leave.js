const config = require('../../config/config.json');

module.exports = {
        name: 'leave',
        description: 'Leave the voice channel.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'leave.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'leave.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'leave.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                await player.destroy();

                const embed = {
                        description: client.lang.__({ phrase: 'leave.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}