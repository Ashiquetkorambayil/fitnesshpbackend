const enrollmentModel = require('../Model/enrollment');
const asyncHandler = require('express-async-handler');

// exports.postEnrollment = asyncHandler(async(req, res)=>{
//     const {amount} = req.body

//     try{
//         await enrollmentModel.create({
//             amount:amount
//         })
//         res.status(200).send('enrollment posted successfully')
//     }catch(err){
//         console.log(err)
//         res.status(500).send('An error occured while posting enrollment')
//     }
// })

exports.getEnrollment = asyncHandler(async(req,res)=>{
    try{
        const response = await enrollmentModel.find()
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.getEnrollmentById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const response = await enrollmentModel.findById(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})


exports.putEnrollment = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {amount} = req.body;
   
   

    try{
    
        const update = {
           amount:amount
        }
        const updateData = await enrollmentModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})

// exports.deletePlansById = asyncHandler(async(req, res)=>{
//     const {id} = req.params
//     try{
//         const response = await planModel.findByIdAndDelete(id)
//         res.status(200).json(response)
//     }catch(err){
//         console.log(err)
//     }
// })