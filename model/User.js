const mongoose = require("mongoose");

const User = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        dropDups: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', User)
