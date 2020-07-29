const send = require('gmail-send');

const config = require('../../config/gmail.config');
const logger = require('../util/logger');

/**
 *
 * @param {String|String[]} to
 * @param {String} subject
 * @param {String} text
 * @param {String=} attachment
 */
module.exports.send = (to, subject, text, attachment) => new Promise(
    (resolve, reject) => {
        const { user, pass } = config;
        send({
            user,
            pass,
            to,
            subject,
            files: attachment ? [attachment] : null
        })({}, (err, res, full) => {
            if (err) {
                logger.error(`* [example 1.1] send() callback returned: ${err}`);
                return reject();
            }
            logger.info(`* [example 1.1] send() callback returned: res: ${res}`);
            return resolve();
        });
    }
);
