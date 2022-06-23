const pretty = require('pretty-ms');
const config = require('../../config/config.json');

module.exports = {
        name: 'play',
        description: 'Plays a song.',
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

		const node = client.player.leastUsedNodes.first();

		if (!node) {
			const error = {
				description: client.lang.__({ phrase: 'play.error5', locale: lang }),
				color: config.embedError
			}

			return interaction.followUp({
				embeds: [error]
			});
		}

                const player = await client.player.create({
                        guild: interaction.guild.id,
                        voiceChannel: interaction.member.voice.channel.id,
                        textChannel: interaction.channel.id,
                        selfDeafen: true
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

                await client.player.search(search, interaction.user.tag).then(async (res) => {
                        switch (res.loadType) {
                                case 'TRACK_LOADED':
                                        await player.queue.add(res.tracks[0]);

                                        if (!player.playing) {
                                                await player.play();
                                        }

                                        const embed = {
                                                description: client.lang.__mf({ phrase: 'play.embed2', locale: lang }, { title: res.tracks[0].title, uri: res.tracks[0].uri, duration: pretty(res.tracks[0].duration), requester: res.tracks[0].requester }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                break;
                                case 'SEARCH_RESULT':
                                        await player.queue.add(res.tracks[0]);

                                        if (!player.playing) {
                                                await player.play();
                                        }

                                        const embed2 = {
                                                description: client.lang.__mf({ phrase: 'play.embed2', locale: lang }, { title: res.tracks[0].title, uri: res.tracks[0].uri, duration: pretty(res.tracks[0].duration), requester: res.tracks[0].requester }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed2]
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