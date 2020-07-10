const searchQueries = require('../controllers/searchQuery.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/searchQueries', auth('job.create'), searchQueries.create);
    app.get('/searchQueries', auth('job'), searchQueries.findAll);
};
