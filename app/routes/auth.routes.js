const auths = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/login', auths.login);

    app.get('/auth/:authId', auth('auth.get'), auths.get);
};
