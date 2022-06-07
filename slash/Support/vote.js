const config = require('../../config/config.json');

module.exports = {
        name: 'vote',
        description: 'Vote for the bot.',
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;

                const embed = {
                        description: client.lang.__({ phrase: 'vote.embed', locale: lang }),
                        color: config.embedColor
                }

                interaction.followUp({
                        embeds: [embed]
                });
        }
}