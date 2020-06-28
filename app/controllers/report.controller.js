const Report = require('../models/report.model');
const ReportUrl = require('../models/reportUrl.model');
const defs = require('../constants');

exports.create = (req, res) => {
    // todo tuku Validate request

    const report = new Report({
        jobId: req.body.jobId,
        status: defs.report.status.INIT,
        result: {
            errorCount: 0,
            message: null
        }
    });

    report.save()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Report.'
            });
        });
};

exports.findAllByJobId = (req, res) => {
    const page = (req.query.page || 1) - 1;
    const limit = req.query.limit || 10;

    Report.find({ jobId: req.params.jobId }, null, { skip: page * 10, limit })
        .then((jobs) => {
            res.send(jobs);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving reports.'
            });
        });
};

exports.findOne = (req, res) => {
    Report.findById(req.params.reportId)
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${req.params.reportId}`
                });
            }

            return res.send(report);
        })
        .catch((err) => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Report not found with id ${req.params.reportId}`
                });
            }
            return res.status(500).send({
                message: `Error retrieving report with id ${req.params.reportId}`
            });
        });
};

exports.delete = (req, res) => {
    const { reportId } = req.params;
    Report.findByIdAndRemove(reportId)
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }

            return res.send({ message: 'Report deleted successfully!' });
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }
            return res.status(500).send({
                message: `Could not delete report with id ${reportId}`
            });
        });
};

exports.updateStatus = (req, res) => {
    const { reportId, newStatus } = req.params;
    // todo validate new status
    Report.findByIdAndUpdate(reportId, { $set: { status: newStatus } })
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }

            return res.send(report);
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }
            return res.status(500).send({
                message: `Could not update report with id ${reportId}`
            });
        });
};

exports.addUrl = (req, res) => {
    // todo tuku Validate request

    const { reportId } = req.params;
    const reportUrl = {
        searchQueryId: req.body.searchQueryId,
        sourcePageUrl: req.body.sourcePageUrl,
        severity: req.body.severity,
        status: req.body.status,
        element: req.body.element,
        ccid: req.body.ccid,
        reason: req.body.reason,
        flag: req.body.flag
    };
    const errorCountChange = reportUrl.status === defs.report.urlStatus.ERROR ? 1 : 0;

    Report.findByIdAndUpdate(reportId, {
        $push: { urls: reportUrl },
        $inc: { 'result.errorCount': errorCountChange }
    })
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }

            return res.status(200).send({ message: 'Report deleted successfully!' });
        })
        .catch((err) => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `Report not found with id ${reportId}`
                });
            }
            return res.status(500).send({
                message: `Could not update report with id ${reportId}`
            });
        });
};
