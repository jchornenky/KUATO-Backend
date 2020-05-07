const mongoose = require('mongoose');

const AuthSchema = mongoose.Schema({
    name: String,
    token: String,
    mail: String,
    username: String,
    password: String,
    active: {type: Boolean, default: true},
    lastConnectedAt: Date,
    permissions: [String]
}, {
    timestamps: true
});

AuthSchema.index({
    token: 1,
    active: 1,
});

module.exports = mongoose.model('auth', AuthSchema);
