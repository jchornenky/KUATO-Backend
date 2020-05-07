module.exports = (app) => {
    const jobs = require('../controllers/job.controller');
    const reports = require('../controllers/report.controller');
    const auth = require('../middlewares/auth.middleware');

    app.post('/jobs', auth('job.create'), jobs.create);
    app.get('/jobs', auth('job'), jobs.findAll);
    app.get('/jobs/:jobId', auth('job'), jobs.findOne);
    app.put('/jobs/:jobId', auth('job.create'), jobs.update);
    app.delete('/jobs/:jobId', auth('job.create'), jobs.delete);

    app.get('/jobs/:jobId/reports', auth('report'), reports.findAllByJobId);
    app.post('/jobs/:jobId/reports', auth('report.create'), reports.create);
};
