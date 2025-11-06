const mongoose = require("mongoose");

const UserRestrictions = new mongoose.Schema({
    withdrawal2Fa: {
        type: Boolean,
        default: false

    },
    requireEmailVerification: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

let UserRestriction = mongoose.model("UserRestriction", UserRestrictions);

module.exports = UserRestriction;
