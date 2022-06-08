const client = require('../../index.js');
const model = require('../../models/language.js');
const config = require('../../config/config.json');

client.on('messageCreate', async (message) => {
        const guildLang = message.member.guild;

        model.findOne({
                Guild: message.guild.id
        }, (err, data) => {
                if (err) throw err;

                const language = data ? data.Language : 'en';

                guildLang.lang = language;
        });

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