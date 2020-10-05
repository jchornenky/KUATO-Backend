const moment = require('moment');

const SearchQueryTemplate = require('../models/searchQueryTemplate.model');

exports.create = (req, res) => {
    // todo Validate request

    const { auth } = req.data;

    const searchQueryTemplate = new SearchQueryTemplate({
        name: req.body.name || `Unnamed Template ${moment().format()}`,
        searchQueries: req.body.searchQueries,
        createdByAuthId: auth.id
    });

    searchQueryTemplate.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Template.'
            });
        });
};

exports.findAll = (req, res) => {
    const { page, limit, query } = req.query;
    const pageOptions = {
        page: parseInt(page, 10) || 0,
        limit: parseInt(limit, 10) || 10
    };

    SearchQueryTemplate
        .find(
            {}
            /*
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } }
            */
        )
        /*
        .sort({ score: { $meta: 'textScore' } })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        */
        .then((searchQueryTemplates) => {
            res.send(searchQueryTemplates);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving Templates.'
            });
        });
};
