const colors = require('colors');

process.on('uncaughtException', (err, origin) => {
        console.log(colors.brightRed(err, origin));
});