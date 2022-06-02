const client = require('../../index.js');

client.player.on('playerMove', async (player, oldChannel, newChannel) => {
        const guild = client.guilds.cache.get(player.guild);

        if (!guild) return;

        if (oldChannel === newChannel) return;

        if (newChannel === null) {
                return player.destroy();
        } else {
                player.voiceChannel = newChannel;
                if (player.paused) {
                        await player.pause(false);
                }
        }
});