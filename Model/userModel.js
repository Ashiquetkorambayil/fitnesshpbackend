const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = new mongoose.Schema({
    name: { type: String},
    image: { type: String },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    height: { type: String},
    weight: { type: String},
    dateOfBirth: { type: String},
    blood: { type: String},
    email: { type: String },
    idProof: { type: String },
    address: { type: String},
    plan: { type: String },
    token: { type: String },
    revealed: { type: Boolean, default: false },
    authenticate: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

userModel.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        // Only hash the password if it's not already hashed
        if (!this.password.startsWith('$2b$')) {
            try {
                const hashedPassword = await bcrypt.hash(this.password, 10);
                this.password = hashedPassword;
            } catch (error) {
                return next(error);
            }
        }
    }

    // Capitalize the first letter of the name
    if (this.isModified('name') || this.isNew) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }

    // Convert the email to lowercase
    if (this.isModified('email') || this.isNew) {
        this.email = this.email.toLowerCase();
    }

    next();
});

const userData = mongoose.model('userData', userModel);

module.exports = userData;
