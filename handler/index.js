const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);
const mongo = require('mongoose');

module.exports = async (client) => {
        const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
        eventFiles.map((value) => require(value));
        
        const slashcommands = await globPromise(`${process.cwd()}/commands/*/*.js`);
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