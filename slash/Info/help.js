const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require('../../config/config.json')

module.exports = {
        name: 'help',
        description: 'See the list of commands.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });

                const row = (state) => [
                        new MessageActionRow()
                                .addComponents(
                                        new MessageSelectMenu()
                                                .setCustomId('help-menu')
                                                .setDisabled(state)
                                                .addOptions([
                                                        {
                                                                label: 'Economy',
                                                                emoji: '💰',
                                                                value: 'economy'
                                                        },
                                                        {
                                                                label: 'Music',
                                                                emoji: '🎧',
                                                                value: 'music'
                                                        },
                                                        {
                                                                label: 'Social',
                                                                emoji: '👤',
                                                                value: 'social'
                                                        },
                                                        {
                                                                label: 'Support',
                                                                emoji: '💌',
                                                                value: 'support'
                                                        },
                                                ])
                                )
                ]

                const embed = {
                        description: 'Select a category.',
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
                                        fields: [
                                                {
                                                        name: 'Commands:',
                                                        value: '📋`/balance`.\n📋 `/deposit`.\n📋 `/rich`.\n📋 `/with-draw`.\n📋 `/work`.'
                                                }
                                        ],
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
                                                        name: 'Commands:',
                                                        value: '📋 `/clear-queue`.\n📋 `/leave`.\n📋 `/loop`.\n📋 `/now-playing`.\n📋 `/pause`.\n📋 `/play`.\n📋 `/queue`.\n📋 `/resume`.\n📋 `/skip-to`.\n📋 `skip`.\n📋 `/volume`.'
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
                                                        name: 'Commands:',
                                                        value: '📋 `/profile description`.\n📋 `/profile follow`.\n📋 `/profile register`.\n📋 `/profile view`.'
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
                                                        name: 'Commands:',
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