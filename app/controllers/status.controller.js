const mongoose = require('mongoose');

exports.check = (req, res) => {
    res.status(200).send({
        status: 'ok'
    });
};

exports.db = (req, res) => {
    res.status(200).send({
        status: mongoose.connection.readyState === 1
    });
};
