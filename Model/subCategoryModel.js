const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    subCategory: { type: String, required: true },
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'optionsData'}
});

// Pre-save hook to capitalize the options field
subCategorySchema.pre('save', function(next) {
    if (this.isModified('subCategory')) {
        this.subCategory = this.subCategory.charAt(0).toUpperCase() + this.subCategory.slice(1).toLowerCase();
    }
    next();
});

const subCategoryData = mongoose.model('subCategoryData', subCategorySchema);
module.exports = subCategoryData;
