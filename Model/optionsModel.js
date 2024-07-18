const mongoose = require('mongoose');

const optionsSchema = new mongoose.Schema({
    options: { type: String, required: true },
});

// Pre-save hook to capitalize the options field
optionsSchema.pre('save', function(next) {
    if (this.isModified('options')) {
        this.options = this.options.charAt(0).toUpperCase() + this.options.slice(1).toLowerCase();
    }
    next();
});

const optionsData = mongoose.model('optionsData', optionsSchema);
module.exports = optionsData;
