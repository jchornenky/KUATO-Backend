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

module.exports.frequencyOptions = {
    NOT_GONNA_RUN: 'NOT_GONNA_RUN',
    RUN_ONCE: 'RUN_ONCE',
    RECURRING: 'RECURRING'
};

module.exports.scheduleOptions = {
    RUN_NOW: 'RUN_NOW',
    NEXT_RUN_DATE: 'NEXT_RUN_DATE'
};

module.exports.notificationSchemaType = {
    MAIL: 'MAIL'
};
