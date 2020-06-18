const mongoose = require('mongoose');

const AuthSchema = mongoose.Schema({
    name: String,
    token: String,
    mail: String,
    username: String,
    password: String,
    active: { type: Boolean, default: true },
    lastConnectedAt: Date,
    permissions: [String]
}, {
    timestamps: true
});

AuthSchema.index({
    token: 1,
    active: 1
});

AuthSchema.methods.exportData = function toExportData() {
    const {
        id, name, mail, username, active, lastConnectedAt
    } = this;
    return {
        id, name, mail, username, active, lastConnectedAt
    };
};

module.exports = mongoose.model('auth', AuthSchema);
