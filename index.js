const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', {
        token: process.env['Token']
});

manager.on('shardCreate', (shard) => {
        console.log('Created shard');
});

manager.spawn();