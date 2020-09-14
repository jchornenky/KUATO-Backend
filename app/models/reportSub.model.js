const mongoose = require('mongoose');

const ReportSubSchema = mongoose.Schema({
    status: String,
    errorCount: Number,
    message: String
});

module.exports = ReportSubSchema;
