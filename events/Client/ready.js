const client = require('../../bot.js');
const config = require('../../config/config.json');
const colors = require('colors');

client.on('ready', () => {
        client.player.init(client.user.id);

        console.log(colors.brightGreen('🟢 [Client] User ' + client.user.tag + ' connected.'));

        const embed = {
                description: 'Restart completed. Servers: `' + client.guilds.cache.size + '`. Users: `' + client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) + '`.',
                color: config.embedColor
        }

        client.channels.cache.get('979427667898138674').send({
                content: '<@945029734943821824>.',
                embeds: [embed]
        }).catch(() => { });

        setInterval(async () => {
                await client.dbl.postStats(client.guilds.cache.size);
        }, 60000);
});