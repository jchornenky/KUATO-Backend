const mongoose = require('mongoose');
const Schema = require("mongoose");

const SearchQuerySchema = mongoose.Schema({
    type: String,
    createdByAuthId: Schema.Types.ObjectId,
    updatedByAuthId: Schema.Types.ObjectId,
    reportFlag: String,
    useRegex: {type: Boolean, default: false},
    isLinks: {type: Boolean, default: false},
    isImages: {type: Boolean, default: false},
    isYoutube: {type: Boolean, default: false},
});

module.exports = SearchQuerySchema;
