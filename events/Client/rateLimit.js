const client = require('../../bot.js');
const colors = require('colors');

client.on('rateLimit', (rateLimitData) => {
        console.log(colors.brightRed(rateLimitData));
});