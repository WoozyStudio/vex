const { MessageEmbed } = require('discord.js');
const config = require('../../config/config.json');
const emoji = require('../../config/emojis.json');

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
                await interaction.deferReply().catch(() => {});
                const search = interaction.options.getString('search');
                
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
                
                const player = client.player.create({
                        guild: interaction.guild.id,
                        voiceChannel: interaction.member.voice.channel.id,
                        textChannel: interaction.channel.id,
                        selfDeafen: true,
                        selfMute: true
                });

                if (player.queue.size > 9) {
                        const error = {
                                description: '❌ The queue exceeds the song limit. (Limit: 10).',
                                color: config.embedError
                        }
                        
                        return interaction.followUp({
                                embeds: [ error ]
                        });
                }

                const state = player.state;

                if (state != 'CONNECTED') {
                        await player.connect();
                }

                const embed = {
                        description: 'Loading... (This may take a few seconds).',
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [ embed ]
                });

                await client.player.search(search, interaction.user).then(async (res) => {
                        switch (res.loadType) {
                                case 'TRACK_LOADED':
                                        await player.queue.add(res.tracks[0]);
                                        
                                        if (!player.playing) {
                                                await player.play();
                                        }

                                        const embed = {
                                                description: 'The song was added to the queue: `' + res.tracks[0].title + '`.',
                                                color: config.embedColor
                                        }
                                        
                                        interaction.followUp({
                                                embeds: [ embed ]
                                        });
                                break;
                                case 'SEARCH_RESULT':
                                        await client.player.search(search, interaction.user).then(async (res2) => {
                                                await player.queue.add(res2.tracks[0]);
                                                
                                                if (!player.playing) {
                                                        await player.play();
                                                }
                                        
                                                const embed = {
                                                        description: 'The song was added to the queue: `' + res.tracks[0].title + '`.',
                                                        color: config.embedColor
                                                }
                                        
                                                interaction.followUp({
                                                        embeds: [ embed ]
                                                });
                                        });
                                break;
                        }
                }).catch((err) => {
                        const error = {
                                description: '❌ An unknown error occurred.',
                                color: config.embedError
                        }
                        
                        const error2 = {
                                description: '❌ Something went wrong... We found this error: `' + err.message + ' - ' + err.stack + '`.\nServer: `' + interaction.guild.name + '`.',
                                color: config.embedError
                        }

                        player.destroy();

                        return interaction.followUp({
                                embeds: [ error ]
                        });

                        client.channels.cache.get(config.logsChannel).send({
                                embeds: [ error2 ]
                        });
                });
        }
}