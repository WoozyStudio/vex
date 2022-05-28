const { convertTime } = require('./convert.js');

module.exports = (duration) => {
        if (isNaN(duration) || typeof duration === 'undefined') {
                return '0:00';
        }

        if (duration > 3600000000) {
                return 'Live';
        }

        return convertTime(duration, true);
}