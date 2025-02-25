const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    profilePicture: String,
    gender: String,
    phoneNumber: String,
    dob: String,
    city: String,
    state: String,
    country: String,
    termsAccepted: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;