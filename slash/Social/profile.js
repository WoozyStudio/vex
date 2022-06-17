const { MessageActionRow, MessageButton } = require('discord.js');
const model = require('../../models/profile.js');
const Filter = require('bad-words');
const filter = new Filter({
        replaceRegex: /[A-Za-z0-9가-힣_]/g,
        placeHolder: '#'
});
const config = require('../../config/config.json');

module.exports = {
        name: 'profile',
        description: '-',
        options: [
                {
                        name: 'register',
                        description: 'Create a profile.',
                        type: 'SUB_COMMAND'
                },
                {
                        name: 'view',
                        description: 'Displays a user\'s profile.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'user',
                                        description: '-',
                                        type: 'USER'
                                }
                        ]
                },
                {
                        name: 'follow',
                        description: 'Follow a user.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'user',
                                        description: '-',
                                        type: 'USER',
                                        required: true
                                }
                        ]
                },
                {
                        name: 'description',
                        description: 'Sets the description.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'description',
                                        description: '-',
                                        type: 'STRING',
                                        required: true
                                }
                        ]
                },
                {
                        name: 'followers',
                        description: 'Displays users who follow you.',
                        type: 'SUB_COMMAND'
                },
                {
                        name: 'unfollow',
                        description: 'Unfollow a user.',
                        type: 'SUB_COMMAND',
                        options: [
                                {
                                        name: 'user',
                                        description: '-',
                                        type: 'USER',
                                        required: true
                                }
                        ]
                },
        ],
        type: 'CHAT_INPUT',
        run: async (client, interaction) => {
                await interaction.deferReply().catch(() => { });
                const lang = interaction.member.guild.lang;
                const subCommand = interaction.options.getSubcommand();

                if (subCommand === 'register') {
                        model.findOne({
                                User: interaction.user.id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.register.error', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                } else {
                                        new model({
                                                User: interaction.user.id,
                                                Username: interaction.user.tag,
                                                AboutMe: 'There is no description.',
                                                Followers: [],
                                                Badges: [],
                                                Avatar: interaction.user.avatarURL()
                                        }).save();

                                        const embed = {
                                                description: client.lang.__({ phrase: 'profile.register.embed', locale: lang }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                }
                        });
                }

                if (subCommand === 'view') {
                        var user = interaction.options.getUser('user');

                        if (!user) {
                                user = interaction.user;
                        }
                        
                        model.findOne({
                                User: user.id
                        }, async (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        const embed = {
                                                thumbnail: {
                                                        url: user.avatarURL({ dynamic: true })
                                                },
                                                author: {
                                                        name: user.tag,
                                                        icon_url: user.avatarURL({ dynamic: true })
                                                },
                                                description: filter.clean(data.AboutMe),
                                                fields: [
                                                        {
                                                                name: client.lang.__({ phrase: 'profile.view.embedField', locale: lang }),
                                                                value: client.lang.__mf({ phrase: 'profile.view.embedFieldValue', locale: lang }, { badges: data.Badges, id: data._id })
                                                        },
                                                        {
                                                                name: client.lang.__({ phrase: 'profile.view.embedField2', locale: lang }),
                                                                value: client.lang.__mf({ phrase: 'profile.view.embedFieldValue2', locale: lang }, { followers: data.Followers.length })
                                                        }
                                                ],
                                                color: config.embedColor,
                                                timestamp: new Date()
                                        }

                                        const row = new MessageActionRow()
                                                .addComponents(
                                                        new MessageButton()
                                                                .setLabel(client.lang.__({ phrase: 'profile.view.button', locale: lang }))
                                                                .setStyle('DANGER')
                                                                .setEmoji('⚠️')
                                                                .setCustomId('profile-view-button')
                                                );

                                        interaction.followUp({
                                                embeds: [embed],
                                                components: [row]
                                        });
                                } else {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.view.error', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }
                        });
                }

                if (subCommand === 'follow') {
                        const user = interaction.options.getUser('user');

                        if (user.id === client.user.id || user.bot) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.follow.error', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        if (user.id === interaction.user.id) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.follow.error2', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        model.findOne({
                                User: user.id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        const followers = data.Followers;

                                        if (followers.includes(interaction.user.id)) {
                                                const error = {
                                                        description: client.lang.__({ phrase: 'profile.follow.error3', locale: lang }),
                                                        color: config.embedError
                                                }

                                                return interaction.followUp({
                                                        embeds: [error]
                                                });
                                        }

                                        followers.push(interaction.user.id);
                                        data.save();

                                        const embed = {
                                                description: client.lang.__({ phrase: 'profile.follow.embed', locale: lang }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                } else {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.follow.error4', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }
                        });
                }

                if (subCommand === 'description') {
                        const description = interaction.options.getString('description');

                        if (description.length > 1000) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.description.error', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        const regExp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

                        if (regExp.test(description) === true) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.description.error2', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        model.findOne({
                                User: interaction.user.id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        data.AboutMe = description;
                                        data.save();

                                        const embed = {
                                                description: client.lang.__({ phrase: 'profile.description.embed', locale: lang }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                } else {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.description.error3', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }
                        });
                }

                if (subCommand === 'followers') {
                        model.findOne({
                                User: interaction.user.id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        var map = data.Followers.map((user) => {
                                                return `<:emoji_1:987398741780750426> <@${user}>.`;
                                        }).join('\n');

                                        if (!map) {
                                                map = client.lang.__({ phrase: 'profile.followers.error', locale: lang });
                                        }

                                        const embed = {
                                                thumbnail: {
                                                        url: interaction.user.avatarURL({ dynamic: true })
                                                },
                                                author: {
                                                        name: interaction.user.tag,
                                                        icon_url: interaction.user.avatarURL({ dynamic: true })
                                                },
                                                description: map,
                                                color: config.embedColor,
                                                timestamp: new Date()
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                } else {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.followers.error2', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }
                        });
                }

                if (subCommand === 'unfollow') {
                        const user = interaction.options.getUser('user');

                        if (user.id === client.user.id || user.bot) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.unfollow.error', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        if (user.id === interaction.user.id) {
                                const error = {
                                        description: client.lang.__({ phrase: 'profile.unfollow.error2', locale: lang }),
                                        color: config.embedError
                                }

                                return interaction.followUp({
                                        embeds: [error]
                                });
                        }

                        model.findOne({
                                User: user.id
                        }, (err, data) => {
                                if (err) throw err;

                                if (data) {
                                        const followers = data.Followers;

                                        if (!followers.includes(interaction.user.id)) {
                                                const error = {
                                                        description: client.lang.__({ phrase: 'profile.unfollow.error3', locale: lang }),
                                                        color: config.embedError
                                                }

                                                return interaction.followUp({
                                                        embeds: [error]
                                                });
                                        }

                                        const pos = followers.indexOf(interaction.user.id);
                                        followers.splice(pos, 1);
                                        data.save();

                                        const embed = {
                                                description: client.lang.__({ phrase: 'profile.unfollow.embed', locale: lang }),
                                                color: config.embedColor
                                        }

                                        interaction.followUp({
                                                embeds: [embed]
                                        });
                                } else {
                                        const error = {
                                                description: client.lang.__({ phrase: 'profile.unfollow.error4', locale: lang }),
                                                color: config.embedError
                                        }

                                        return interaction.followUp({
                                                embeds: [error]
                                        });
                                }
                        });
                }
        }
}