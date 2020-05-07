const mongoose = require('mongoose');

const AuthPermissionInfoSchema = mongoose.Schema({
    name: String,
    description: String
}, {
    timestamps: true
});

AuthPermissionInfoSchema.index({
    name: 1
});

module.exports = mongoose.model('auth.permissioninfos', AuthPermissionInfoSchema);
