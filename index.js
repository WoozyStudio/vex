const { ShardingManager } = require('discord.js')
const manager = require('./bot.js', {
	token: process.env.Token
});

manager.on('shardCreate', (shard) => {
        console.log('Shard ' + shard.id + ' created.');
});

manager.spawn('auto');