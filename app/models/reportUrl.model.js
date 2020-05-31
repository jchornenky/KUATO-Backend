const mongoose = require('mongoose');

const ReportUrlSchema = mongoose.Schema({
    searchQueryId: mongoose.Schema.Types.ObjectId,
    sourcePageUrl: String,
    element: String,
    ccid: String,
    reason: String,
    flag: String
});

module.exports = ReportUrlSchema;
