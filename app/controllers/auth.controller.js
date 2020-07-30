const crypto = require('crypto');
const passwordHash = require('password-hash');

const Auth = require('../models/auth.model.js');
const logger = require('../util/logger');


exports.create = (req, res) => {
    // todo Validate request

    const password = passwordHash.generate(req.body.password);
    const token = crypto.randomBytes(64).toString('hex');

    const auth = new Auth({
        name: req.body.name,
        token,
        mail: req.body.mail,
        username: req.body.username,
        password
    });

    auth.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Job.'
            });
        });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = passwordHash.generate(password);

    const projection = 'name token mail password username permissions';
    Auth.find({ username }, projection)
        .then((auths) => {
            if (!auths || auths.length === 0) {
                return res.status(403).json({ error: new Error('Invalid auth!') });
            }

            const auth = auths[0];
            if (!passwordHash.verify(password, auth.password)) {
                return res.status(403).json({ error: new Error('Invalid auth!') });
            }

            return res.send(auth.exportData());
        })
        .catch((err) => {
            if (err.kind === 'ObjectId') {
                return res.status(403).json({ error: new Error('Invalid auth!') });
            }
            return res.status(500).send({ message: 'Error login!' });
        });
};

exports.addPermission = (req, res) => {
    // todo tuku Validate request
    const { authId } = req.params;
    const { permission } = req.params;

    Auth.findByIdAndUpdate(authId, { $push: { permissions: permission } })
        .then((auth) => {
            if (!auth) {
                return res.status(404).send({
                    message: `Auth not found with id ${authId}`
                });
            }

            return res.send({ message: 'permission added successfully!' });
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Auth not found with id ${authId}` });
            }
            return res.status(500).send({ message: `Could not update auth with id ${authId}` });
        });
};

exports.deletePermission = (req, res) => {
    // todo tuku Validate request
    const { authId } = req.params;
    const { permission } = req.params;

    Auth.findByIdAndUpdate(authId, { $pull: { permissions: permission } })
        .then((auth) => {
            if (!auth) {
                return res.status(404).send({ message: `Auth not found with id ${authId}` });
            }

            return res.send({ message: 'permission deleted successfully!' });
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({ message: `Auth not found with id ${authId}` });
            }
            return res.status(500).send({ message: `Could not update auth with id ${authId}` });
        });
};

exports.get = (req, res) => {
    const { authId } = req.params;
    logger.info(`auth; findOne #${authId}`);
    Auth.findById(authId)
        .then((auth) => {
            if (!auth) {
                return res.status(404).send({ message: `Auth not found with id ${authId}` });
            }
            return res.send(auth.exportData());
        })
        .catch((err) => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: `Auth not found with id ${authId}` });
            }
            return res.status(500).send({ message: `Error retrieving auth with id ${authId}` });
        });
};
