const winston = require('winston');
const {Loggly} = require('winston-loggly-bulk');

const loggerConfig = require('../../config/logger.config');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

if (loggerConfig.errorLogging) {
    logger.add(new winston.transports.File({filename: loggerConfig.errorLogging.path, level: 'error'}));
}

if (loggerConfig.combinedLogging) {
    logger.add(new winston.transports.File({filename: loggerConfig.combinedLogging.path}));
}

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
else {
    logger.add(new Loggly({
        token: loggerConfig.logglyToken,
        subdomain: loggerConfig.logglySubdomain,
        tags: loggerConfig.logglyTags,
        json: true
    }));
}

module.exports = logger;
