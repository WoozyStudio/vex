const client = require('../../index.js');
const model = require('../../models/language.js');
const config = require('../../config/config.json');

client.on('interactionCreate', async (interaction) => {
        if (!interaction.guildId) return;

        const guildLang = interaction.member.guild;

        model.findOne({
                Guild: interaction.guild.id
        }, (err, data) => {
                if (err) throw err;

                const language = data ? data.Language : 'en';

                guildLang.lang = language;
        });

        if (interaction.isCommand()) {
                const lang = interaction.member.guild.lang;
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

                if (cmd) {
                        cmd.run(client, interaction)
                }
        }
});