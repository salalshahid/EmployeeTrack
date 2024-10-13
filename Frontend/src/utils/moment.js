const moment = require('moment-timezone');

export const combineDateTime = (date, time, timezone = 'Europe/Helsinki') => {
    return moment.tz(`${date} ${time}`, timezone).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ (z)');
}