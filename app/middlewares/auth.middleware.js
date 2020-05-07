const Auth = require('../models/auth.model');
const logger = require('../util/logger');

module.exports = (permission) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            Auth.findOne({token: token})
                .then(auth => {
                    if (!auth) {
                        return res.status(403).json({error: new Error('Invalid auth!')});
                    }

                    // check if required permission is set for the user
                    if (permission) {
                        if (!auth.permissions || auth.permissions.indexOf(permission) === -1) {
                            return res.status(403).json({error: new Error('Invalid auth!')});
                        }
                    }

                    req.data.auth = auth;
                    next();
                })
                .catch(err => {
                    logger.error('auth; err: ' + err);
                    res.status(403).json({error: new Error('Invalid auth!')});
                });
        }
        catch (err) {
            logger.error('unable to login with token: ' + req.headers.authorization);
            return res.status(500).send({message: "error!"});
        }
    };
};
