const amqp = require('amqplib/callback_api');
const mqConfig = require('../../config/mq.config');
const logger = require('../util/logger');

/**
 *
 * @return {Promise<Channel>}
 */
module.exports.connect = () => new Promise((resolve, reject) => {
    amqp.connect(mqConfig.url, (error0, connection) => {
        if (error0) {
            return reject(error0);
        }
        return connection.createChannel((error1, channel) => {
            if (error1) {
                return reject(error1);
            }
            channel.assertQueue(mqConfig.queueName, {
                durable: true
            });

            return resolve(channel);
        });
    });
});

/**
 * write doc.
 * @param jobId
 * @return {Promise<boolean>}
 */
module.exports.sendToJobQueue = (jobId) => new Promise((resolve, reject) => {
    this.connect()
        .then((channel) => {
            channel.sendToQueue(mqConfig.queueName, Buffer.from(jobId));
            logger.info(`job queued #${jobId}`);
            return resolve(true);
        })
        .catch((reason) => {
            logger.error('unable to queue job', reason);
            return resolve(false);
        });
});
