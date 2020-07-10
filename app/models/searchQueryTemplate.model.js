const mongoose = require('mongoose');

const SearchQuerySchema = require('./searchQuery.model');

const SearchQueryTemplateSchema = mongoose.Schema({
    name: String,
    createdByAuthId: mongoose.Schema.Types.ObjectId,
    searchQueries: [SearchQuerySchema]
}, {
    timestamps: true
});

SearchQueryTemplateSchema.index({
    name: 1,
    createdAt: 1,
    createdByAuthId: 1
});

module.exports = mongoose.model('searchQueryTemplates', SearchQueryTemplateSchema);
