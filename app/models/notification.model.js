const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    type: String,
    recipient: String
});

module.exports = NotificationSchema;
