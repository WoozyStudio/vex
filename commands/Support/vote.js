const config = require('../../config/config.json');

module.exports = {
        name: 'vote',
        description: 'Vote for the bot.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => {});

                const embed = {
                        description: 'Vote on [FlowBots](https://www.flowbots.net/bot/955921440002179132).\nVote on [VCodez](https://vcodez.xyz/bot/955921440002179132).',
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [ embed ]
                });
        }
}