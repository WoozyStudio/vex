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
                                        description: 'Economy commands:',
                                        fields: [
                                                {
                                                        name: 'Commands:',
                                                        value: '`/balance`, `/deposit`, `/rich`, `/with-draw`, `/work`.'
                                                }
                                        ],
                                        image: {
                                                url: 'https://media.discordapp.net/attachments/977895960170598401/979805107690557480/standard.gif'
                                        },
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
                                        description: 'Music commands:',
                                        fields: [
                                                {
                                                        name: 'Commands:',
                                                        value: '`/clear-queue`, `/leave`, `/loop`, `/now-playing`, `/pause`, `/play`, `/queue`, `/resume`, `/skip-to`, `skip`, `/volume`.'
                                                }
                                        ],
                                        image: {
                                                url: 'https://media.discordapp.net/attachments/977895960170598401/979805107690557480/standard.gif'
                                        },
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
                                        description: 'Music commands:',
                                        fields: [
                                                {
                                                        name: 'Commands:',
                                                        value: '`/profile description`, `/profile follow`, `/profile register`, `/profile view`.'
                                                }
                                        ],
                                        image: {
                                                url: 'https://media.discordapp.net/attachments/977895960170598401/979805107690557480/standard.gif'
                                        },
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
                                        description: 'Support commands:',
                                        fields: [
                                                {
                                                        name: 'Commands:',
                                                        value: '`/vote`.'
                                                }
                                        ],
                                        image: {
                                                url: 'https://media.discordapp.net/attachments/977895960170598401/979805107690557480/standard.gif'
                                        },
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