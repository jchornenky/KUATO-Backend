const Report = require('../models/report.model');
const ReportUrl = require('../models/reportUrl.model');

exports.create = (req, res) => {
    // todo tuku Validate request

    const report = new Report({
        jobId: req.params.jobId,
        status: req.body.status,
    });

    report.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Report."
            });
        });
};

exports.findAllByJobId = (req, res) => {
    let page = (req.query.page || 1) - 1;
    let limit = req.query.limit || 10;

    Report.find({jobId: req.params.jobId}, null, {skip: page * 10, limit: limit})
        .then(jobs => {
            res.send(jobs);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving reports."
            });
        });
};

exports.findOne = (req, res) => {
    Report.findById(req.params.reportId)
        .then(report => {
            if (!report) {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }
            res.send(report);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }
            return res.status(500).send({
                message: "Error retrieving report with id " + req.params.reportId
            });
        });
};

exports.delete = (req, res) => {
    Report.findByIdAndRemove(req.params.reportId)
        .then(report => {
            if (!report) {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }

            res.send({message: "Report deleted successfully!"});
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }
            return res.status(500).send({
                message: "Could not delete report with id " + req.params.reportId
            });
        });
};

exports.addUrl = (req, res) => {

    // todo tuku Validate request

    let reportUrl = new ReportUrl({
        searchQueryId: req.body.searchQueryId,
        sourcePageUrl: req.body.sourcePageUrl,
        element: req.body.element,
        ccid: req.body.ccid,
        reason: req.body.reason,
        flag: req.body.flag,
    });

    Report.findByIdAndUpdate(req.params.reportId, {$push: {urls: reportUrl}})
        .then(report => {
            if (!report) {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }

            res.send({message: "Report deleted successfully!"});
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Report not found with id " + req.params.reportId
                });
            }
            return res.status(500).send({
                message: "Could not update report with id " + req.params.reportId
            });
        });
};
