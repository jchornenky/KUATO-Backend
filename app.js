const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const dbConfig = require('./config/database.config.js');
const logger = require('./app/util/logger');
const jobService = require('./app/services/job.service');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Configuring the database
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: dbConfig.useNewUrlParser,
    useUnifiedTopology: dbConfig.useUnifiedTopology,
    autoIndex: dbConfig.autoIndex
}).then(() => {
    logger.info('Successfully connected to the database');
}).catch((err) => {
    logger.error('Could not connect to the database. Exiting now...', err);
    process.exit();
});

mongoose.set('debug', dbConfig.debug);
mongoose.set('toJSON', { virtuals: true });

// define a simple route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Kuato backend application.' });
});

app.options('*', cors());

require('./app/routes/job.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/report.routes')(app);
require('./app/routes/status.routes')(app);

// schedule job runs
cron.schedule('*/5 * * * *', () => {
    jobService.queueAvailableJobs().then();
});

// listen for requests
app.listen(3000, () => {
    logger.info('Server is listening on port 3000');
    console.log('Server is listening on port 3000');
});
