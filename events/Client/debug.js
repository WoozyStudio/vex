const client = require('../../index.js');
const colors = require('colors');

client.on('debug', (e) => {
        console.info(colors.brightCyan(e));
});