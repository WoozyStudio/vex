const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);
const mongo = require('mongoose');

module.exports = async (client) => {
        const commandFiles = await globPromise(`${process.cwd()}/commands/*/*.js`);

        commandFiles.map((value) => {
                const file = require(value);
                const splitted = value.split('/');
                const directory = splitted[splitted.length - 2];

                if (file.name) {
                        const properties = { directory, ...file };
                        client.commands.set(file.name, properties);
                }
        });

        const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
        eventFiles.map((value) => require(value));

        const slashcommands = await globPromise(`${process.cwd()}/slash/*/*.js`);
        const commands = [];

        slashcommands.map((value) => {
                const file = require(value);

                if (!file.name) return;

                client.slashcommands.set(file.name, file);

                if (['MESSAGE', 'USER'].includes(file.type)) delete file.description;
                commands.push(file);
        });

        client.on('ready', async () => {
                await client.application.commands.set(commands);
        });

        mongo.connect(process.env['Mongo']).then(() => {
                console.log('[MongoDB] Database connected.');
        });
};