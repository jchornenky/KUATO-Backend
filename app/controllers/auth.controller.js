const crypto = require('crypto');
const passwordHash = require('password-hash');

const Auth = require('../models/auth.model.js');


exports.create = (req, res) => {
    // todo Validate request

    let password = passwordHash.generate(req.body.password);
    let token = crypto.randomBytes(64).toString('hex');

    const auth = new Auth({
        name: req.body.name,
        token: token,
        mail: req.body.mail,
        username: req.body.username,
        password: password,
    });

    auth.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Job."
        });
    });
};

exports.login = (req, res) => {
    let password = passwordHash.generate(req.body.password);

    let projection = 'name token mail username permissions';
    Auth.find({
        username: req.body.username,
        password: password
    }, projection)
        .then(auth => {
            if (!auth) {
                return res.status(403).json({error: new Error('Invalid auth!')});
            }
            res.send(auth);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(403).json({error: new Error('Invalid auth!')});
            }
            return res.status(500).send({
                message: "Error login!"
            });
        });
};

exports.addPermission = (req, res) => {

    // todo tuku Validate request
    let authId = req.params.authId;
    let permission = req.params.permission

    Auth.findByIdAndUpdate(authId, {$push: {permissions: permission}})
        .then(auth => {
            if (!auth) {
                return res.status(404).send({
                    message: "Auth not found with id " + authId
                });
            }

            res.send({message: "permission added successfully!"});
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Auth not found with id " + authId
                });
            }
            return res.status(500).send({
                message: "Could not update auth with id " + authId
            });
        });
};

exports.deletePermission = (req, res) => {

    // todo tuku Validate request
    let authId = req.params.authId;
    let permission = req.params.permission

    Auth.findByIdAndUpdate(authId, {$pull: {permissions: permission}})
        .then(auth => {
            if (!auth) {
                return res.status(404).send({
                    message: "Auth not found with id " + authId
                });
            }

            res.send({message: "permission deleted successfully!"});
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Auth not found with id " + authId
                });
            }
            return res.status(500).send({
                message: "Could not update auth with id " + authId
            });
        });
};
