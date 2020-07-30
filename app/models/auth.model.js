const mongoose = require('mongoose');

const { Schema } = mongoose;

const AuthSchema = new Schema({
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

AuthSchema.methods.exportData = function exportData() {
    const {
        id, name, mail, username, active, lastConnectedAt, token
    } = this;
    return {
        id, name, mail, username, active, lastConnectedAt, token
    };
};

module.exports = mongoose.model('auth', AuthSchema);
