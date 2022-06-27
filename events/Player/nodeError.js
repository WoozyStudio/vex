const client = require('../../bot.js');

client.player.on('nodeError', (node, error) => {
        console.log(
		'Node ' + node.options.identifier + ' has an error: ' + error.message + '.'
	);
});