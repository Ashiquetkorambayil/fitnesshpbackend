const planModel = require('../Model/planModel');
const asyncHandler = require('express-async-handler');

exports.postPlan = asyncHandler(async(req, res)=>{
    const {hour, amount, duration, description, category} = req.body
    
    try{
        await planModel.create({
            hour:hour,
            amount:amount,
            duration:duration,
            description:description,
            category:category
        })
        res.status(200).send('plans posted successfully')
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while posting plans')
    }
})

exports.getPlans = asyncHandler(async(req,res)=>{
    try{
        const response = await planModel.find()
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.getPlansById = asyncHandler(async(req,res)=>{
  
    try{
        const plan = await planModel.findById(req.params.id).populate('description category');
        if (!plan) {
            return res.status(404).send();
        }
        res.status(200).send(plan);
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.getPlansByOptions = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const response = await planModel.find({description : id})
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})



exports.putPlans = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {hour, amount, duration, description, category} = req.body;
   
   

    try{
    
        const update = {
           hour:hour,
           amount:amount,
           duration:duration,
           description:description,
           category:category
        }
        const updateData = await planModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})

exports.deletePlansById = asyncHandler(async(req, res)=>{
    const {id} = req.params
    try{
        const response = await planModel.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
    }
})