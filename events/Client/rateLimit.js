const client = require('../../index.js');
const colors = require('colors');

client.on('rateLimit', (rateLimitData) => {
        console.log(colors.brightRed(rateLimitData));
});