const client = require('../../index.js');
const format = require('../../structures/formatDuration.js');
const config = require('../../config/config.json');

client.player.on('trackStart', (player, track) => {
        const embed = {
                thumbnail: {
                        url: 'https://img.youtube.com/vi/' + track.identifier + '/hqdefault.jpg'
                },
                description: '[' + track.title + '](' + track.uri + ').',
                fields: [
                        {
                                name: 'Information:',
                                value: '👤 Author: `' + track.author + '`.\n⏰ Duration: `' + format(player.position) + ' / ' + format(track.duration) + '`.'
                        }
                ],
                color: config.embedColor,
                timestamp: new Date()
        }

        client.channels.cache.get(player.textChannel).send({
                embeds: [embed]
        }).catch(() => { });
});