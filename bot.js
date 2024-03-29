const { Client, Collection } = require('discord.js');
const client = new Client({
        shards: 'auto',
        restTimeOffSet: 0,
        allowedMentions: {
                parse: [
                        'users', 
                        'roles'
                ]
        },
        intents: [
                'GUILDS',
                'GUILD_MESSAGES',
                'GUILD_VOICE_STATES'
        ],
        partials: [
                'MESSAGE',
                'CHANNEL',
                'REACTION'
        ]
});
require('dotenv').config();
require('./handler')(client);

client.login(process.env.Token);

const { Manager } = require('erela.js');
const dbl = require('dblapi.js');
const path = require('path');

const nodes = [
	{
		host: 'vex-lavalink-server.lonelydeathvgx.repl.co',
		password: 'vex-lavalink-server',
		port: 443,
		secure: true
	}
	/*{
                host: 'lava.link',
                password: 'changeyourpassword',
                port: 80
        },
	{
		host: 'www.exlink.ml',
		password: 'exlava',
		port: 443,
		secure: true
	},*/
];

client.slashcommands = new Collection();
client.dbl = new dbl(process.env.TopGG, client);
client.lang = require('i18n');
client.player = new Manager({
        nodes,
        send: (id, payload) => {
                const guild = client.guilds.cache.get(id);

                if (guild) {
                        guild.shard.send(payload);
                }
        }
});

client.lang.configure({
        locales: [
		'en',
		'es', 
		'de'
	],
        directory: path.join(__dirname, 'locales'),
        defaultLocale: 'en',
        retryInDefaultLocale: true,
        objectNotation: true,
        register: global,
	logWarnFn: function (msg) {
		console.log(
			msg
		);
	},
	logErrorFn: function (msg) {
		console.log(
			msg
		);
	},
	missingKeyFn: function (locale, value) {
		return value;
	},
        mustacheConfig: {
                tags: [
			'{{', 
			'}}'
		],
                disable: false
        }
});

client.lang.setLocale('en');

module.exports = client;