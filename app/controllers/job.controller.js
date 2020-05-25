const Job = require('../models/job.model.js');
const logger = require('../util/logger');

exports.create = (req, res) => {
    // todo Validate request

    const job = new Job({
        name: req.body.name || "Unnamed Job",
        isInstant: req.body.isInstant
    });

    job.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Job."
        });
    });
};

exports.findAll = (req, res) => {
    Job.find()
        .then(jobs => {
            res.send(jobs);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving jobs."
        });
    });
};

exports.findOne = (req, res) => {
    let jobId = req.params.jobId;
    logger.info('jobs; findOne #' + jobId);
    Job.findById(jobId)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    message: "Job not found with id " + req.params.jobId
                });
            }
            res.send(job);
        }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Job not found with id " + req.params.jobId
            });
        }
        return res.status(500).send({
            message: "Error retrieving job with id " + req.params.jobId
        });
    });
};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {
    Job.findByIdAndRemove(req.params.jobId)
        .then(job => {
            if (!job) {
                return res.status(404).send({
                    message: "Job not found with id " + req.params.jobId
                });
            }
            res.send({message: "Job deleted successfully!"});
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Job not found with id " + req.params.jobId
            });
        }
        return res.status(500).send({
            message: "Could not delete job with id " + req.params.jobId
        });
    });
};
