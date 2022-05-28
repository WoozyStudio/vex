const client = require('../../index.js');
const colors = require('colors');

client.player.on('nodeReconnect', (node) => {
        console.log(colors.brightYellow('[Node] Node ' + node.options.identifier + ' reconnected.'));
});