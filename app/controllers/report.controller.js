const nunjucks = require('nunjucks');
const pdf = require('html-pdf');
const moment = require('moment');

const Report = require('../models/report.model');
const ReportUrl = require('../models/reportUrl.model');
const logger = require('../util/logger');

const defs = require('../constants');
const services = require('../services');
const folderConfig = require('../../config/folder.config');

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

exports.exportExcel = (req, res) => {
    Report.findById(req.params.reportId)
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${req.params.reportId}`
                });
            }

            try {
                const fullPath = services.excel.exportData(
                    JSON.parse(JSON.stringify(report.toJSON({ virtuals: false }))).urls, report.jobId
                );

                if (fullPath) {
                    return res.download(fullPath);
                }
            }
            catch (e) {
                logger.error('parse data to excel error', e);
                return res.status(500).send({
                    message: `Error retrieving report with id ${req.params.reportId}`
                });
            }

            return res.status(500).send({
                message: `Error retrieving report with id ${req.params.reportId}`
            });
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

exports.exportPdf = (req, res) => {
    nunjucks.configure(folderConfig.templates, { autoescape: true });

    Report.findById(req.params.reportId)
        .then((report) => {
            if (!report) {
                return res.status(404).send({
                    message: `Report not found with id ${req.params.reportId}`
                });
            }

            try {
                const htmlData = nunjucks.render('report.template.html.njk', {
                    urls: JSON.parse(JSON.stringify(report.toJSON({ virtuals: false }))).urls,
                    reportName: report.jobId
                });

                const options = {
                    format: 'Letter',
                    orientation: "landscape"
                };
                const finalFileName = `${folderConfig.pdf}/${moment().format()}_${report.jobId}.pdf`;

                return pdf.create(htmlData, options).toFile(finalFileName, (err, response) => {
                    if (err) {
                        return res.status(500).send({
                            message: `Error retrieving report with id ${req.params.reportId}`
                        });
                    }
                    return res.download(finalFileName);
                });
            }
            catch (e) {
                logger.error('parse data to excel error', e);
                return res.status(500).send({
                    message: `Error retrieving report with id ${req.params.reportId}`
                });
            }
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
        flagUrl: req.body.flagUrl,
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
