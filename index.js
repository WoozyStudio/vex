const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', {
        token: process.env['Token']
});
const colors = require('colors');

manager.on('shardCreate', (shard) => {
        console.log(colors.brightGreen('🟢 [Shard] Shard ' + shard.id + ' created.'));
});

manager.spawn();