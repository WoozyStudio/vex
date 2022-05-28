const client = require('../../index.js');
const colors = require('colors');

client.on('warn', (e) => {
        console.warn(colors.brightRed(e));
});