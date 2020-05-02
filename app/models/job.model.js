const mongoose = require('mongoose');

const NotificationSchema = require('./notification.model');

const JobSchema = mongoose.Schema({
    name: String,
    dueAt: Date,
    frequency: Number,
    isInstant: {type: Boolean, default: false},
    status: {type: String, default: 'INIT'},
    notifications: [NotificationSchema],
}, {
    timestamps: true
});

module.exports = mongoose.model('jobs', JobSchema);
