const client = require('../../bot.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config/config.json');

client.on('guildCreate', (guild) => {
        var channelToSend;

        guild.channels.cache.forEach((channel) => {
                if (channel.type === 'GUILD_TEXT' && !channelToSend && channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
                        channelToSend = channel;
                }
        });

        if (!channelToSend) return;

        const row = new MessageActionRow()
        .addComponents(
                new MessageButton()
                .setLabel('Support')
                .setStyle('LINK')
                .setURL(config.support)
        );
        
        const embed = {
		thumbnail: {
			url: client.user.avatarURL()
		},
		author: {
			name: client.user.tag,
			icon_url: client.user.avatarURL()
		},
                description: '<:emoji_1:987398741780750426> Hi, thanks for inviting me. I\'m Vex, a multi-language, multi-functional and totally free bot.\n<:emoji_1:987398741780750426> I currently use Slash Commands, so you can put `/help` to see my command list.\n<:emoji_1:987398741780750426> If you don\'t get Slash Commands on your server, you can kick the bot and re-invite it using this [link](https://discord.com/api/oauth2/authorize?client_id=955921440002179132&permissions=8&scope=bot%20applications.commands).',
                image: {
                        url: 'https://cdn.discordapp.com/attachments/977896126613192706/984492009853186088/vex.jpg'
                },
                color: config.embedColor,
                timestamp: new Date()
        }
        
        channelToSend.send({
                embeds: [embed],
                components: [row]
        });
});