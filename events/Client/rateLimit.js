const client = require('../../bot.js');

client.on('rateLimit', (rateLimitData) => {
        console.info(rateLimitData);
});