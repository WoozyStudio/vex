const client = require('../../bot.js');

client.player.on('queueEnd', (player) => {
        player.destroy();
});