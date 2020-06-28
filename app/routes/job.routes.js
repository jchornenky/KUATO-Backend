const jobs = require('../controllers/job.controller');
const reports = require('../controllers/report.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/jobs', auth('job.create'), jobs.create);
    app.get('/jobs', auth('job'), jobs.findAll);
    app.get('/jobs/:jobId', auth('job'), jobs.findOne);
    app.put('/jobs/:jobId', auth('job.create'), jobs.update);
    app.post('/jobs/:jobId/activate', auth('job.create'), jobs.activate);
    app.post('/jobs/:jobId/deactivate', auth('job.create'), jobs.deactivate);
    app.delete('/jobs/:jobId', auth('job.create'), jobs.delete);

    app.post('/jobs/queueAvailable', auth('job'), jobs.queueAvailable);

    app.post('/jobs/:jobId/url', auth('job.create'), jobs.addUrl);
    app.delete('/jobs/:jobId/url/:urlId', auth('job.create'), jobs.deleteUrl);

    app.post('/jobs/:jobId/searchQuery', auth('job.create'), jobs.addSearchQuery);
    app.delete('/jobs/:jobId/searchQuery/:searchQueryId', auth('job.create'), jobs.deleteSearchQuery);

    app.get('/jobs/:jobId/reports', auth('report'), reports.findAllByJobId);
    app.post('/jobs/:jobId/reports', auth('report.create'), reports.create);
};
