const client = require('../../index.js');
const colors = require('colors');

client.player.on('nodeConnect', (node) => {
        console.log(colors.brightGreen('[Node] Node ' + node.options.identifier + ' connected.'));
});