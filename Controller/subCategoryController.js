const subCategoryData = require('../Model/subCategoryModel');
const asyncHandler = require('express-async-handler')

// Create a new sub-category
exports.createSubCategory = asyncHandler(async (req, res) => {
    try {
        const newSubCategory = new subCategoryData(req.body);
        const savedSubCategory = await newSubCategory.save();
        res.status(201).json(savedSubCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all sub-categories
exports.getAllSubCategories = asyncHandler(async (req, res) => {
    try {
        const subCategories = await subCategoryData.find().populate('category');
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single sub-category by ID
exports.getSubCategoryById = asyncHandler(async (req, res) => {
    try {
        const subCategory = await subCategoryData.findById(req.params.id).populate('category');
        if (!subCategory) {
            return res.status(404).json({ message: 'Sub-category not found' });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

exports.getSubCategoriesById = asyncHandler(async (req, res) => {
    const {id} = req.params
    try {
        const subCategory = await subCategoryData.find({category : id}).populate('category');
        if (!subCategory) {
            return res.status(404).json({ message: 'Sub-category not found' });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a sub-category by ID
exports.updateSubCategory = asyncHandler(async (req, res) => {
    try {
        const updatedSubCategory = await subCategoryData.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSubCategory) {
            return res.status(404).json({ message: 'Sub-category not found' });
        }
        res.status(200).json(updatedSubCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a sub-category by ID
exports.deleteSubCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    console.log(req.params,'this is the params')
    try {
         await subCategoryData.findByIdAndDelete(id);
        res.status(200).json({ message: 'Sub-category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
