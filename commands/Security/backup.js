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
                                const error = {
                                        description: '❌ You do not have sufficient permissions, you need `Administrator`.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error ]
                                });
                        }
                        
                        if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) {
                                const error = {
                                        content: '❌ I do not have sufficient permissions, I need `Administrator`.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error ]
                                });
                        }
                
                        const embed = {
                                description: 'Loading... (This may take a few seconds).',
                                color: config.embedColor
                        }
                
                        interaction.followUp({
                                embeds: [ embed ]
                        });

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

                                const embed = {
                                        description: 'The backup was successfully created.',
                                        fields: [
                                                {
                                                        name: '💾 Backup data:',
                                                        value: '> ID: `' + res.id + '`.\n> Server: `' + interaction.guild.name + '`.'
                                                }
                                        ],
                                        color: config.embedColor
                                }
                                
                                interaction.followUp({
                                        embeds: [ embed ]
                                });
                        });
                }
                
                if (subCommand === 'load') {
                        const id = interaction.options.getString('id');
                        
                        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                                const error = {
                                        description: '❌ You do not have sufficient permissions, you need `Administrator`.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error ]
                                });
                        }
                        
                        if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) {
                                const error = {
                                        content: '❌ I do not have sufficient permissions, I need `Administrator`.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error ]
                                });
                        }
                        
                        if (interaction.user.id !== interaction.guild.ownerId) {
                                const error = {
                                        description: '❌ You do not have sufficient permissions, you need to be the owner of the server.',
                                        color: config.embedError
                                }
                                
                                return interaction.followUp({
                                        embeds: [ error ]
                                });
                        }

                        model.findOne({
                                Id: id
                        }, (err, data) => {
                                if (err) throw err;
                                
                                if (data) {
                                        if (interaction.user.id !== data.User) {
                                                const error = {
                                                        description: '❌ You cannot use a backup from another user.',
                                                        color: config.embedError
                                                }
                                                
                                                return interaction.followUp({
                                                        embeds: [ error ]
                                                });
                                        }

                                        backup.fetch(id).then(async () => {
                                                const row = (state) => [
                                                        new MessageActionRow()
                                                        .addComponents(
                                                                new MessageButton()
                                                                .setLabel('Confirm')
                                                                .setEmoji('✅')
                                                                .setCustomId('confirm')
                                                                .setStyle('SECONDARY')
                                                                .setEmoji(emoji.done)
                                                                .setDisabled(state),
                                                                new MessageButton()
                                                                .setLabel('Cancel')
                                                                .setEmoji('❌')
                                                                .setCustomId('cancel')
                                                                .setStyle('SECONDARY')
                                                                .setEmoji(emoji.close)
                                                                .setDisabled(state)
                                                        )
                                                ]

                                                const embed = {
                                                        description: 'Are you sure you want to upload the backup? If you do, everything will be deleted and replaced.\nClick `Confirm` to upload the backup.',
                                                        color: config.embedColor
                                                }
                                                
                                                const msg = await interaction.followUp({
                                                        embeds: [ embed ],
                                                        components: row(false)
                                                });

                                                const collector = msg.createMessageComponentCollector({
                                                        filter: (i) => i.user.id === interaction.user.id,
                                                        time: 10000
                                                });

                                                collector.on('collect', async (i) => {
                                                        if (i.customId === 'confirm') {
                                                                const embed = {
                                                                        description: 'Loading... (This may take a few seconds).',
                                                                        color: config.embedColor
                                                                }

                                                                i.update({
                                                                        embeds: [ embed ]
                                                                });

                                                                backup.load(id, interaction.guild, {
                                                                        clearGuildBeforeRestore: true
                                                                }).then(() => {}).catch((err) => {
                                                                        const error = {
                                                                                description: '❌ An unknown error occurred.',
                                                                                color: config.embedError
                                                                        }
                                                                        
                                                                        const error2 = {
                                                                                description: '❌ Something went wrong... We found this error: `' + err.message + ' - ' + err.stack + '`.\nServer: `' + interaction.guild.name + '`.',
                                                                                color: config.embedError
                                                                        }
                                                                        
                                                                        interaction.followUp({
                                                                                embeds: [ error ]
                                                                        });

                                                                        client.channels.cache.get(config.logsChannel).send({
                                                                                embeds: [ error2 ]
                                                                        });
                                                                });
                                                        }

                                                        if (i.customId === 'cancel') {
                                                                const embed = {
                                                                        description: 'The backup was cancelled.',
                                                                        color: config.embedColor
                                                                }
                                                                
                                                                i.update({
                                                                        embeds: [ embed ],
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
                                        const error = {
                                                description: '❌ The backup was not found.',
                                                color: config.embedError
                                        }
                                        
                                        interaction.followUp({
                                                embeds: [ error ]
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
                                        return `> \`${index + 1}.\` ${backup.Id} - (\`${backup.GuildName}\`).`;
                                }).join('\n');

                                if (!map) {
                                        map = '> ❌ There are no backups.';
                                }

                                const embed = {
                                        thumbnail: {
                                                url: interaction.user.avatarURL({ dynamic: true })
                                        },
                                        description: 'Your backups:',
                                        fields: [
                                                {
                                                        name: '📋 Backups:',
                                                        value: map
                                                }
                                        ],
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }
                                
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
                                                const error = {
                                                        description: '❌ You cannot use a backup from another user.',
                                                        color: config.embedError
                                                }
                                                
                                                return interaction.followUp({
                                                        embeds: [ error ]
                                                });
                                        }

                                        backup.remove(id);
                                        data.delete();

                                        const embed = {
                                                description: 'The backup was removed.',
                                                color: config.embedColor
                                        }
                                        
                                        interaction.followUp({
                                                embeds: [ embed ]
                                        });
                                }
                        });
                }
        }
}