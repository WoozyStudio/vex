const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const client = require('../../bot.js');
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
                const cmd = client.slashcommands.get(interaction.commandName);

                if (!cmd) return;

                const args = [];

                for (let option of interaction.options.data) {
                        if (option.type === 'SUB_COMMAND') {
                                if (option.name) {
					args.push(option.name);
				}
				
                                option.options.forEach((x) => {
                                        if (x.value) {
						args.push(x.value);
					}
                                });
                        } else if (option.value) {
				args.push(option.value);
			}
                }

                if (cmd) {
                        cmd.run(client, interaction)
                }
        }

        if (interaction.isButton()) {
                if (interaction.customId === 'profile-view-button') {
                        const modal = new Modal()
                        .setTitle('Report a user profile.')
                        .setCustomId('profile-view-modal')

                        const reason = new TextInputComponent()
                        .setCustomId('modal-reason')
                        .setLabel('Why do you want to report the user?')
                        .setStyle('PARAGRAPH')
                        .setMaxLength(250)
                        .setRequired(true)

                        const row = new MessageActionRow()
                        .addComponents(reason)

                        modal.addComponents(row);

                        await interaction.showModal(modal);
                }
        }

        if (interaction.isModalSubmit()) {
                if (interaction.customId === 'profile-view-modal') {
                        const reason = interaction.fields.getTextInputValue('modal-reason');

                        const embed = {
                                description: interaction.message.embeds[0].description,
                                fields: [
                                        {
                                                name: 'Profile of the reported user:',
                                                value: interaction.message.embeds[0].fields[0].value
                                        },
                                        {
                                                name: 'Reason and user:',
                                                value: '❓ Reason: `' + reason + '`.\n👤 User: `' + interaction.user.tag + ' (' + interaction.user.id + ')`.'
                                        }
                                ],
                                color: config.embedColor,
                                timestamp: new Date()
                        }
                        
                        client.channels.cache.get(config.logsChannel).send({
                                content: '<@&986624544724897812>',
                                embeds: [embed]
                        });

                        const embed2 = {
                                description: 'The report was sent.',
                                color: config.embedColor
                        }
                        
                        interaction.reply({
                                embeds: [embed2],
                                ephemeral: true
                        });
                }
        }
});