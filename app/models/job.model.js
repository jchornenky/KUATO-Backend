const mongoose = require('mongoose');

const NotificationSchema = require('./notification.model');
const SearchQuerySchema = require('./searchQuery.model');

const JobSchema = mongoose.Schema({
    name: String,
    dueAt: Date,
    createdByAuthId: ObjectId,
    updatedByAuthId: ObjectId,
    frequency: Number,
    isInstant: {type: Boolean, default: false},
    status: {type: String, default: 'INIT'},
    notifications: [NotificationSchema],
    searchQueries: [SearchQuerySchema],
    urls: [String]
}, {
    timestamps: true
});

JobSchema.index({
    dueAt: 1,
    createdAt: 1,
    updatedAt: 1,
    status: 1,
    createdByAuthId: 1,
    updatedByAuthId: 1,
});

module.exports = mongoose.model('jobs', JobSchema);
