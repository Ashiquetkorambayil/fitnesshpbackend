const asyncHandler = require('express-async-handler')
const optionsModel = require('../Model/optionsModel')

exports.postOptions = asyncHandler(async(req, res)=>{
    const {options} = req.body

    try{
        await optionsModel.create({
            options:options
        })
        res.status(200).send('options posted successfully')
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while posting options')
    }
})

exports.getOptions = asyncHandler(async(req,res)=>{
    try {
        const response = await optionsModel.find()
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured while fetching options')
    }
})

exports.getOptionsById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const response = await optionsModel.findById(id);
        res.status(200).json(response); // Combine JSON response and status
    } catch (error) {
        console.log(error);
        res.status(500).send('An error occured while fetching options');
    }
});


exports.editOptions = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { options } = req.body;


    try {
        const update = {
            options: options
        };
        const updateData = await optionsModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        res.status(200).json(updateData);
    } catch (err) {
        console.error('Error while updating data:', err);
        res.status(500).json({ err: 'Error while updating data' });
    }
});


exports.deleteOptionsByid = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const response = await optionsModel.findByIdAndDelete(id)
       
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured while deleting options')
    }
})