const config = require('../../config/config.json');

module.exports = {
        name: 'skip-to',
        description: 'Skips the song to the indicated position.',
        options: [
                {
                        name: 'position',
                        description: '-',
                        type: 'INTEGER',
                        required: true,
                        minValue: 0
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
                const position = interaction.options.getInteger('position');

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip-to.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip-to.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.get(interaction.guild.id);

                if (!player) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip-to.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (player.queue.size < 1) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip-to.error4', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (position > player.queue.size) {
                        const error = {
                                description: client.lang.__({ phrase: 'skip-to.error5', locale: lang }),
                                color: config.embedError
                        }


                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                await player.queue.splice(0, position - 1);
                await player.stop();

                const embed = {
                        description: client.lang.__({ phrase: 'skip-to.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}