const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require('../../config/config.json')

module.exports = {
        name: 'help',
        description: 'Displays the bot commands.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const row = (state) => [
                        new MessageActionRow()
                                .addComponents(
                                        new MessageSelectMenu()
                                                .setCustomId('help-menu')
                                                .setDisabled(state)
                                                .addOptions([
                                                        {
                                                                label: client.lang.__({ phrase: 'help.options.economy', locale: lang }),
                                                                emoji: '💰',
                                                                value: 'economy'
                                                        },
                                                        {
                                                                label: client.lang.__({ phrase: 'help.options.info', locale: lang }),
                                                                emoji: 'ℹ️',
                                                                value: 'info'
                                                        },
                                                        {
                                                                label: client.lang.__({ phrase: 'help.options.music', locale: lang }),
                                                                emoji: '🎧',
                                                                value: 'music'
                                                        },
                                                        {
                                                                label: client.lang.__({ phrase: 'help.options.social', locale: lang }),
                                                                emoji: '👤',
                                                                value: 'social'
                                                        },
                                                        {
                                                                label: client.lang.__({ phrase: 'help.options.support', locale: lang }),
                                                                emoji: '💌',
                                                                value: 'support'
                                                        },
                                                ])
                                )
                ]

                const embed = {
                        description: client.lang.__({ phrase: 'help.embed', locale: lang }),
                        color: config.embedColor
                }

                const msg = await interaction.followUp({
                        embeds: [embed],
                        components: row(false)
                });

                const collector = msg.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.user.id,
                        time: 120000,
                        componentType: 'SELECT_MENU'
                });

                collector.on('collect', async (i) => {
                        if (i.values[0] === 'economy') {
                                const embed = {
                                        thumbnail: {
                                                url: client.user.avatarURL()
                                        },
                                        author: {
                                                name: client.user.tag,
                                                icon_url: client.user.avatarURL()
                                        },
                                        description: client.lang.__({ phrase: 'help.embed2', locale: lang }),
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }

                                i.update({
                                        embeds: [embed]
                                });
                        }
                        
                        if (i.values[0] === 'info') {
                                const embed = {
                                        thumbnail: {
                                                url: client.user.avatarURL()
                                        },
                                        author: {
                                                name: client.user.tag,
                                                icon_url: client.user.avatarURL()
                                        },
                                        description: client.lang.__({ phrase: 'help.embed3', locale: lang }),
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }

                                i.update({
                                        embeds: [embed]
                                });
                        }

                        if (i.values[0] === 'music') {
                                const embed = {
                                        thumbnail: {
                                                url: client.user.avatarURL()
                                        },
                                        fields: [
                                                {
                                                        name: client.lang.__({ phrase: 'help.embedField', locale: lang }),
                                                        value: '📋 `/clear-queue`.\n📋 `/leave`.\n📋 `/loop`.\n📋 `/now-playing`.\n📋 `/pause`.\n📋 `/play`.\n📋 `/queue`.\n📋 `/resume`.\n📋 `/skip-to`.\n📋 `/skip`.\n📋 `/volume`.'
                                                }
                                        ],
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }

                                i.update({
                                        embeds: [embed]
                                });
                        }

                        if (i.values[0] === 'social') {
                                const embed = {
                                        thumbnail: {
                                                url: client.user.avatarURL()
                                        },
                                        fields: [
                                                {
                                                        name: client.lang.__({ phrase: 'help.embedField', locale: lang }),
                                                        value: '📋 `/profile description`.\n📋 `/profile follow`.\n📋 `/profile followers`.\n📋 `/profile register`.\n📋 `/profile unfollow`.\n📋 `/profile view`.'
                                                }
                                        ],
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }

                                i.update({
                                        embeds: [embed]
                                });
                        }

                        if (i.values[0] === 'support') {
                                const embed = {
                                        thumbnail: {
                                                url: client.user.avatarURL()
                                        },
                                        fields: [
                                                {
                                                        name: client.lang.__({ phrase: 'help.embedField', locale: lang }),
                                                        value: '📋 `/vote`.'
                                                }
                                        ],
                                        color: config.embedColor,
                                        timestamp: new Date()
                                }

                                i.update({
                                        embeds: [embed]
                                });
                        }
                });

                collector.on('end', () => {
                        msg.edit({
                                components: row(true)
                        });
                });
        }
}