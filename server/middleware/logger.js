const colors = require('colors');

// logger on the app level
const logger = (req, res, next) => {
    const methodColors = {
        GET: 'green',
        POST: 'blue',
        PUT: 'yellow',
        DELETE: 'red'
    }

    const color = methodColors[req.method] || 'white'

    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`[
        color
    ]);
    next();
}

module.exports = logger;