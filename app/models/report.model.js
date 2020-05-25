const mongoose = require('mongoose');

const ReportUrlSchema = require('./reportUrl.model');
const Schema = require("mongoose");

const ReportSchema = mongoose.Schema({
    jobId: Schema.Types.ObjectId,
    status: {type: String, default: 'INIT'},
    urls: [ReportUrlSchema]
}, {
    timestamps: true
});

ReportSchema.index({
    jobId: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
});

module.exports = mongoose.model('reports', ReportSchema);
