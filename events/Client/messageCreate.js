const client = require('../../index.js');
const model = require('../../models/language.js');
const config = require('../../config/config.json');

client.on('messageCreate', async (message) => {
        const prefix = '!';

        if (message.author.bot) return;

        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!command) return;
        
        if (command) {
                await command.run(client, message, args);
        }
});