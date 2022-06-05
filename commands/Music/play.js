const config = require('../../config/config.json');

module.exports = {
        name: 'play',
        description: 'Plays a song on the voice channel.',
        options: [
                {
                        name: 'search',
                        description: '-',
                        type: 'STRING',
                        required: true
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
                const search = interaction.options.getString('search');

                if (!interaction.member.voice.channel) {
                        const error = {
                                description: client.lang.__({ phrase: 'play.error', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
                        const error = {
                                description: client.lang.__({ phrase: 'play.error2', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const player = client.player.create({
                        guild: interaction.guild.id,
                        voiceChannel: interaction.member.voice.channel.id,
                        textChannel: interaction.channel.id
                });

                if (player.queue.size > 9) {
                        const error = {
                                description: client.lang.__({ phrase: 'play.error3', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                }

                const state = player.state;

                if (state != 'CONNECTED') {
                        await player.connect();
                }

                const embed = {
                        description: client.lang.__({ phrase: 'play.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });

                await client.player.search(search, interaction.user).then(async (res) => {
                        switch (res.loadType) {
                                case 'TRACK_LOADED':
                                        await player.queue.add(res.tracks[0]);

                                        if (!player.playing) {
                                                await player.play();
                                        }

                                        const embed = {
                                                description: client.lang.__mf({ phrase: 'play.embed2', locale: lang }, { res: res.tracks[0].title }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                        break;
                                case 'SEARCH_RESULT':
                                        await client.player.search(search, interaction.user).then(async (res2) => {
                                                await player.queue.add(res2.tracks[0]);

                                                if (!player.playing) {
                                                        await player.play();
                                                }

                                                const embed = {
                                                        description: client.lang.__mf({ phrase: 'play.embed2', locale: lang }, { res: res.tracks[0].title }),
                                                        color: config.embedColor
                                                }

                                                interaction.followUp({
                                                        embeds: [embed]
                                                });
                                        });
                                        break;
                        }
                }).catch((err) => {
                        player.destroy();

                        const error = {
                                description: client.lang.__({ phrase: 'play.error4', locale: lang }),
                                color: config.embedError
                        }

                        return interaction.followUp({
                                embeds: [error]
                        });
                });
        }
}