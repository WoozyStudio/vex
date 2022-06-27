const client = require('../../bot.js');

client.player.on('nodeConnect', (node) => {
        console.log(
		'Node ' + node.options.identifier + ' connected.'
	);
});