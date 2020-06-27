const mongoose = require('mongoose');

const defs = require('../constants');

const NotificationSchema = require('./notification.model');
const SearchQuerySchema = require('./searchQuery.model');

const JobSchema = mongoose.Schema({
    name: String,
    dueAt: Date,
    lastRunAt: Date,
    createdByAuthId: mongoose.Schema.Types.ObjectId,
    updatedByAuthId: mongoose.Schema.Types.ObjectId,
    frequency: String,
    active: { type: Boolean, default: false },
    isInstant: { type: Boolean, default: false },
    status: { type: String, default: defs.job.status.INIT },
    notifications: [NotificationSchema],
    searchQueries: [SearchQuerySchema],
    urls: [String]
}, {
    timestamps: true
});

JobSchema.index({
    dueAt: 1,
    lastRunAt: 1,
    createdAt: 1,
    updatedAt: 1,
    status: 1,
    active: 1,
    frequency: 1,
    createdByAuthId: 1,
    updatedByAuthId: 1
});

module.exports = mongoose.model('jobs', JobSchema);
