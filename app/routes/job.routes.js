module.exports = (app) => {
    const jobs = require('../controllers/job.controller.js');

    app.post('/jobs', jobs.create);
    app.get('/jobs', jobs.findAll);
    app.get('/jobs/:jobId', jobs.findOne);
    app.put('/jobs/:jobId', jobs.update);
    app.delete('/jobs/:jobId', jobs.delete);
}
