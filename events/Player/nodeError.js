const client = require('../../bot.js');
const colors = require('colors');

client.player.on('nodeError', (node, error) => {
        console.log(colors.brightRed('🔴 [Lavalink] Node ' + node.options.identifier + ' has an error: ' + error.message + '.'));
});