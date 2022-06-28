const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

module.exports = async (client) => {
        const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
        eventFiles.map((value) => require(value));

        const slashcommands = await globPromise(`${process.cwd()}/slash/*/*.js`);
        const commands = [];

        slashcommands.map((value) => {
                const file = require(value);

                if (!file.name) return;

                client.slashcommands.set(file.name, file);

		const array = [
			'MESSAGE',
			'USER'
		];

                if (array.includes(file.type)) {
			delete file.description;
		}
		
                commands.push(file);
        });

        client.on('ready', async () => {
                await client.application.commands.set(commands);
        });
};