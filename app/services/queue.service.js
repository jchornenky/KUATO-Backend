const amqp = require('amqplib/callback_api');
const mqConfig = require('../../config/mq.config');

module.exports = {
    /**
     *
     * @return {Promise<Channel>}
     */
    connect: () => new Promise((resolve, reject) => {
        amqp.connect(mqConfig.url, (error0, connection) => {
            if (error0) {
                return reject(error0);
            }
            return connection.createChannel((error1, channel) => {
                if (error1) {
                    return reject(error1);
                }
                channel.assertQueue(mqConfig.queueName, {
                    durable: false
                });

                return resolve(channel);
            });
        });
    }),
    /**
     * write doc.
     * @param jobId
     * @return {Promise<boolean>}
     */
    sendToJobQueue: (jobId) => new Promise((resolve, reject) => {
        this.connect()
            .then((channel) => {
                channel.sendToQueue(mqConfig.queueName, Buffer.from(jobId));
                return resolve(true);
            })
            .catch(reject);
    })
};
