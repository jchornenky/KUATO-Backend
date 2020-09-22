const mongoose = require('mongoose');

const ReportUrlSchema = mongoose.Schema({
    searchQueryId: mongoose.Schema.Types.ObjectId,
    name: String,
    severity: String,
    sourcePageUrl: String,
    flagUrl: String,
    status: String,
    element: String,
    ccid: String,
    reason: String
});

module.exports = ReportUrlSchema;
