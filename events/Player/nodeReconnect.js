const client = require('../../bot.js');
const colors = require('colors');

client.player.on('nodeReconnect', (node) => {
        console.log(colors.brightYellow('🟡 [Lavalink] Node ' + node.options.identifier + ' reconnected.'));
});