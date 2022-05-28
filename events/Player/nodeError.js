const client = require('../../index.js');
const colors = require('colors');

client.player.on('nodeError', (node, error) => {
        console.log(colors.brightRed('[Node] Node ' + node.options.identifier + ' has an error: ' + error.message + '.'));
});