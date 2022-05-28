const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const model = require('../../models/backup.js');
const backup = require('discord-backup');
const config = require('../../config/config.json');
const emoji = require('../../config/emojis.json');

module.exports = {
        name: 'backup',
        description: '-',
        options: [
                {
                        name: 'create',
                        description: 'Create a backup.',
                        type: 'SUB_COMMAND'
                },
                {
                        name: 'load',
                        description: 'Load a backup.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'id',
                                        description: '-',
                                        type: 'STRING',
                                        required: true
                                }
                        ]
                },
                {
                        name: 'list',
                        description: 'Displays your saved backups.',
                        type: 'SUB_COMMAND'
                },
                {
                        name: 'remove',
                        description: 'Remove a backup.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'id',
                                        description: '-',
                                        type: 'STRING',
                                        required: true
                                }
                        ]
                }
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});
                const subCommand = interaction.options.getSubcommand();

                if (subCommand === 'create') {
                        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                                return interaction.followUp({
                                        content: emoji.close + ' You do not have sufficient permissions, you need `Administrator`.'
                                });
                        }
                        
                        if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) {
                                return interaction.followUp({
                                        content: emoji.close + ' I do not have sufficient permissions, I need `Administrator`.'
                                });
                        }

                        await backup.create(interaction.guild, {
                                maxMessagesPerChannel: 0,
                                jsonBeautify: true,
                                saveImages: 'base64',
                                jsonSave: true
                        }).then(async (res) => {
                                await new model({
                                        User: interaction.user.id,
                                        Id: res.id,
                                        GuildName: interaction.guild.name
                                }).save();
                                
                                interaction.followUp({
                                        content: emoji.done + ' The backup was successfully created.\n' + emoji.arrow_forward + ' Backup ID: `' + res.id + '`.'
                                });
                        });
                }
                
                if (subCommand === 'load') {
                        const id = interaction.options.getString('id');
                        
                        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                                return interaction.followUp({
                                        content: emoji.close + ' You do not have sufficient permissions, you need `Administrator`.'
                                });
                        }
                        
                        if (interaction.user.id !== interaction.guild.ownerId) {
                                return interaction.followUp({
                                        content: emoji.close + ' You do not have sufficient permissions, you need to be the owner of the server.'
                                });
                        }
                        
                        if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) {
                                return interaction.followUp({
                                        content: emoji.close + ' I do not have sufficient permissions, I need `Administrator`.'
                                });
                        }

                        model.findOne({
                                Id: id
                        }, (err, data) => {
                                if (err) throw err;
                                
                                if (data) {
                                        if (interaction.user.id !== data.User) {
                                                return interaction.followUp({
                                                        content: emoji.close + ' You cannot use a backup from another user.'
                                                });
                                        }

                                        backup.fetch(id).then(async () => {
                                                const row = (state) => [
                                                        new MessageActionRow()
                                                        .addComponents(
                                                                new MessageButton()
                                                                .setLabel('Confirm')
                                                                .setCustomId('confirm')
                                                                .setStyle('SECONDARY')
                                                                .setEmoji(emoji.done)
                                                                .setDisabled(state),
                                                                new MessageButton()
                                                                .setLabel('Cancel')
                                                                .setCustomId('cancel')
                                                                .setStyle('SECONDARY')
                                                                .setEmoji(emoji.close)
                                                                .setDisabled(state)
                                                        )
                                                ]
                                                
                                                const msg = await interaction.followUp({
                                                        content: 'You are about to load this backup, remember that all the channels, roles, etc... will be replaced.\nClick \'**Confirm**\' to load the backup.\n\nBackup information:\n\n' + emoji.arrow_forward + ' Server: `' + data.GuildName + '`.',
                                                        components: row(false)
                                                });

                                                const collector = msg.createMessageComponentCollector({
                                                        filter: (i) => i.user.id === interaction.user.id,
                                                        time: 10000
                                                });

                                                collector.on('collect', async (i) => {
                                                        if (i.customId === 'confirm') {
                                                                i.update({
                                                                        content: emoji.done + ' Loading... (This may take a few seconds).'
                                                                });

                                                                backup.load(id, interaction.guild, {
                                                                        clearGuildBeforeRestore: true
                                                                }).then(() => {}).catch((err) => {
                                                                        interaction.followUp({
                                                                                content: emoji.close + ' Something went wrong... We found this error: `' + err.message + '`.'
                                                                        });
                                                                });
                                                        }

                                                        if (i.customId === 'cancel') {
                                                                i.update({
                                                                        content: emoji.done + ' The backup was cancelled.',
                                                                        components: row(true)
                                                                });
                                                        }
                                                });

                                                collector.on('end', () => {
                                                        msg.edit({
                                                                components: row(true)
                                                        });
                                                });
                                        });
                                } else {
                                        interaction.followUp({
                                                content: emoji.close + ' No results found.'
                                        });
                                }
                        });
                }

                if (subCommand === 'list') {
                        model.find({
                                User: interaction.user.id
                        }, (err, data) => {
                                if (err) throw err;

                                var map = data.map((backup, index) => {
                                        return `${emoji.arrow_forward} \`${index + 1}.\` ${backup.Id} - (\`${backup.GuildName}\`).`;
                                }).join('\n');

                                if (!map) {
                                        map = emoji.arrow_forward + ' There are no backups.';
                                }

                                const embed = new MessageEmbed()
                                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                                .setDescription('Your backups:')
                                .addFields(
                                        {
                                                name: emoji.menu_book + ' Backups:',
                                                value: map
                                        }
                                )
                                .setColor(config.embedColor)
                                .setTimestamp()
                                
                                interaction.followUp({
                                        embeds: [ embed ]
                                });
                        });
                }

                if (subCommand === 'remove') {
                        const id = interaction.options.getString('id');
                        
                        model.findOne({
                                Id: id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        if (interaction.user.id !== data.User) {
                                                return interaction.followUp({
                                                        content: emoji.close + ' You cannot use a backup from another user.'
                                                });
                                        }

                                        backup.remove(id);
                                        data.delete();

                                        interaction.followUp({
                                                content: emoji.done + ' The backup was removed.'
                                        });
                                }
                        });
                }
        }
}