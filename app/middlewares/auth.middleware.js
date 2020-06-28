const Auth = require('../models/auth.model');
const logger = require('../util/logger');

module.exports = (permission, checkQuery = false) => (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (checkQuery && !token) {
            token = req.query.auth;
        }
        Auth.findOne({ token })
            .then((auth) => {
                if (!auth) {
                    return res.status(403).json({ error: new Error('Invalid auth!') });
                }

                // check if required permission is set for the user
                if (permission) {
                    if (!auth.permissions || auth.permissions.indexOf(permission) === -1) {
                        return res.status(403).json({ error: new Error('Invalid auth!') });
                    }
                }

                if (!req.data) {
                    req.data = {};
                }
                req.data.auth = auth;
                return next();
            })
            .catch((err) => {
                logger.error(`auth; err: ${err}`);
                return res.status(403).json({ error: 'Invalid auth!' });
            });
    }
    catch (err) {
        logger.error(`unable to login with token: ${req.headers.authorization}`);
        return res.status(500).send({ message: 'error!' });
    }
};
