const reports = require('../controllers/report.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/reports', auth('report.create'), reports.create);
    app.get('/reports/:reportId', auth('report'), reports.findOne);
    app.delete('/reports/:reportId', auth('report.create'), reports.delete);

    app.get('/reports/:reportId/excel', auth('report', true), reports.exportExcel);
    app.get('/reports/:reportId/pdf', auth('report', true), reports.exportPdf);

    app.put('/reports/:reportId/status/:newStatus', auth('report.create'), reports.updateStatus);
    app.post('/reports/:reportId/urls', auth('report.create'), reports.addUrl);
};
