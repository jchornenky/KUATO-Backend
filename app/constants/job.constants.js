module.exports.searchQueryTypes = {
    TEXT_MATCH: 'TEXT_MATCH',
    ERROR: 'ERROR', // deprecated
    REGEX: 'REGEX',
    XPATH: 'XPATH',
    STATUS_CHECK: 'STATUS_CHECK',
    URL_CHECK: 'URL_CHECK'
};

module.exports.searchQuerySeverity = {
    MINOR: 'MINOR',
    MEDIUM: 'MEDIUM',
    MAJOR: 'MAJOR',
    KNOWN_ISSUE: 'KNOWN_ISSUE'
};

module.exports.status = {
    INIT: 'INIT',
    RUNNING: 'RUNNING',
    RECURRING: 'RECURRING',
    COMPLETED: 'COMPLETED',
    CANCELED: 'CANCELED',
    DEACTIVATED: 'DEACTIVATED'
};

module.exports.notificationSchemaType = {
    MAIL: 'MAIL'
};
