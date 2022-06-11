const client = require('../../bot.js');

client.on('raw', (d) => {
        client.player.updateVoiceState(d);
});