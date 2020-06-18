const auths = require('../controllers/auth.controller');

module.exports = (app) => {
    app.post('/admin/auths', auths.create);

    app.put('/admin/auth/:authId/permission/:permission', auths.addPermission);
    app.delete('/admin/auth/:authId/permission/:permission', auths.deletePermission);
};
