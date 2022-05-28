const client = require('../../index.js');

client.player.on('queueEnd', (player) => {
        player.destroy();
});