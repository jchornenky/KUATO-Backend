module.exports = (app) => {
    const reports = require('../controllers/report.controller');
    const auth = require('../middlewares/auth.middleware');

    app.get('/reports/:reportId', auth('report'), reports.findOne);
    app.delete('/reports/:reportId', auth('report.create'), reports.delete);

    app.post('/reports/:reportId/urls', auth('report.create'), reports.addUrl);
};
