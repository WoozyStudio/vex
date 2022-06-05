const client = require('../../index.js');
const model = require('../../models/language.js');

client.on('interactionCreate', async (interaction) => {
        const Guild = interaction.member.guild;
        
        model.findOne({
                Guild: interaction.guild.id
        }, (err, data) => {
                if (err) throw err;
                
                const language = data ? data.Language : 'en';

                Guild.lang = language;
        });
        
        if (!interaction.guildId) return;
        
        if (interaction.isCommand()) {
                
                const cmd = client.slashcommands.get(interaction.commandName);

                if (!cmd) return;

                const args = [];

                for (let option of interaction.options.data) {
                        if (option.type === 'SUB_COMMAND') {
                                if (option.name) args.push(option.name);
                                option.options.forEach((x) => {
                                        if (x.value) args.push(x.value);
                                });
                        } else if (option.value) args.push(option.value);
                }
                cmd.run(client, interaction, args);
        }
});