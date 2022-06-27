const client = require('../../bot.js');
const mongoose = require('mongoose');
const config = require('../../config/config.json');

client.on('ready', async () => {
	client.user.setPresence({
		activities: [
			{
				name: '🎉 03/07/22 | /help'
			}
		],
		status: 'offline'
	});
	
        client.player.init(client.user.id);

        console.log(
		'User ' + client.user.tag + ' connected.'
	);

	await mongoose.connect(process.env.Mongo).then(() => {
		console.log(
			'Database connected.'
		);
	});
	
        client.channels.cache.get(config.logsChannel).send({
                content: '<@945029734943821824> - Restart completed. Servers: `' + client.guilds.cache.size + '`. Users: `' + client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) + '`.',
                embeds: [embed]
        }).catch(() => { });

        setInterval(async () => {
                await client.dbl.postStats(client.guilds.cache.size);
        }, 60000);
});