const status = require('../controllers/status.controller');

module.exports = (app) => {
    app.get('/status', status.check);
    app.get('/status/db', status.db);
};
