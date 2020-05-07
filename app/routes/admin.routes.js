module.exports = (app) => {
    const auths = require('../controllers/auth.controller');

    app.post('/admin/auths', auths.create);

    app.put('/admin/auth/:authId/permission/:permission', auths.addPermission);
    app.delete('/admin/auth/:authId/permission/:permission', auths.deletePermission);
};
