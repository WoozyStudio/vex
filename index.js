const { Client, Collection } = require('discord.js');
const client = new Client({
        shards: 'auto',
        restTimeOffSet: 0,
        allowedMentions: {
                parse: ['users', 'roles']
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

client.login(process.env['Token']);

const { Manager } = require('erela.js');

const nodes = [
        {
                host: 'lava.link',
                password: 'changeyourpassword',
                port: 80
        }
];

client.slashcommands = new Collection();
client.player = new Manager({
        nodes,
        send: (id, payload) => {
                const guild = client.guilds.cache.get(id);

                if (guild) {
                        guild.shard.send(payload);
                }
        }
});

const express = require('express');
const app = express();

app.get('/', (req, res) => {
        res.send('Hi!');
});

app.listen(process.env.PORT);

module.exports = client;
