const Job = require('../models/job.model');
const SearchQuery = require('../models/searchQuery.model');
const Auth = require('../models/auth.model');

module.exports = {
    /**
     *
     * @param {string} jobId
     * @param {string} url
     * @return {Promise<Job>}
     */
    addUrlToJob: (jobId, url) => {
        return new Promise((resolve, reject) => {
            Job.findById(jobId)
                .then(job => {
                    if (!job) {
                        return reject({status: 404, message: "Job not found with id " + jobId});
                    }

                    job.urls.push(url)
                    job.save()
                        .then(data => {
                            return resolve(data);
                        })
                        .catch(err => {
                            return reject({
                                status: 500,
                                message: err.message || "Some error occurred while saving the Job."
                            });
                        });
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return reject({status: 404, message: "Job not found with id " + jobId});
                    }
                    return reject({status: 500, message: "Error saving job with id " + jobId});
                });
        });
    },
    /**
     *
     * @param {string} jobId
     * @param {string} url
     * @return {Promise<Job>}
     */
    deleteUrlFromJob: (jobId, url) => {
        return new Promise((resolve, reject) => {
            Job.updateOne({_id: jobId}, {$pull: {url: url}})
                .then(job => {
                    return resolve(job);
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return reject({status: 404, message: "Job not found with id " + jobId});
                    }
                    return reject({status: 500, message: "Error saving job with id " + jobId});
                });
        });
    },
    /**
     *
     * @param {string} jobId
     * @param {Object} searchQueryData
     * @param {Auth} auth
     * @param {string} searchQueryData.name
     * @param {string} searchQueryData.type
     * @param {string} searchQueryData.query
     * @param {string} searchQueryData.reason
     * @param {string} searchQueryData.severity
     * @return {Promise<Job>}
     */
    addSearchQueryToJob: (jobId, searchQueryData, auth) => {
        return new Promise((resolve, reject) => {

            const searchQuery = new SearchQuery({
                name: searchQueryData.name,
                type: searchQueryData.type,
                query: searchQueryData.query,
                reason: searchQueryData.reason,
                severity: searchQueryData.severity,
                createdByAuthId: auth._id,
            });

            Job.updateOne({_id: jobId}, {$push: {searchQueries: searchQuery}})
                .then(job => {
                    return resolve(job);
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return reject({status: 404, message: "Job not found with id " + jobId});
                    }
                    return reject({status: 500, message: "Error saving job with id " + jobId});
                });
        });
    },
    /**
     *
     * @param {string} jobId
     * @param {string} searchQueryId
     * @return {Promise<Job>}
     */
    deleteSearchQueryFromJob: (jobId, searchQueryId) => {
        return new Promise((resolve, reject) => {
            Job.updateOne({_id: jobId}, {$pull: {searchQueries: {_id: searchQueryId}}})
                .then(job => {
                    return resolve(job);
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return reject({status: 404, message: "Job not found with id " + jobId});
                    }
                    return reject({status: 500, message: "Error saving job with id " + jobId});
                });
        });
    },
};
