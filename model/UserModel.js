const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },

    otp: {
        type: String,
    },

    otpExpiry: {
        type: Date,
    },

     isVerified: {
        type: Boolean,
        default: false,
     },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };