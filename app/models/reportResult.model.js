const mongoose = require('mongoose');

const ReportResultSchema = mongoose.Schema({
    errorCount: Number,
    message: String
});

module.exports = ReportResultSchema;
