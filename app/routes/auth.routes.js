module.exports = (app) => {
    const auths = require('../controllers/auth.controller');

    app.post('/login', auths.login);
};
