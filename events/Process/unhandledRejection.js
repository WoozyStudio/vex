const colors = require('colors');

process.on('unhandledRejection', (reason, p) => {
        console.log(colors.brightRed(reason, p));
});