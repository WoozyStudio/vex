const client = require('../../bot.js');

client.player.on('nodeReconnect', (node) => {
        console.log('Node ' + node.options.identifier + ' reconnected.');
});