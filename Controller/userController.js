const userModel = require('../Model/userModel');
const plandOrderModel = require('../Model/plandOrderModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');


exports.onlineUser = asyncHandler(async (req, res) => {
    const { name, phone, password, height, weight, dateOfBirth, blood, email, modeOfPayment, planId, planName, amount, duration} = req.body; 
    const image = req.file ? req.file.filename : undefined;
    
    try {
        // Validate inputs
        if (!name || !phone || !password || !height || !weight || !dateOfBirth || !blood || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if the phone number already exists
        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: "Phone number already exists" });
        }
        const expiryDate = moment().add(duration, 'months').toDate();
        
        // Create the user
        const newUser = await userModel.create({
            image,
            name,
            phone,
            password,
            height,
            weight,
            dateOfBirth,
            blood,
            email,
            authenticate: true,
            newUser:true,
        });
        
        
        // Log the successful creation
        // console.log("New user created:", newUser, newPlanOrder);

        // Respond with success message and the created user
        res.status(200).json({
            message: 'User posted successfully',
            user: newUser
        });
        
    } catch (err) {
        // Log the error
        console.error("Error posting user:", err);

        // Respond with a generic error message
        res.status(500).json({ message: 'An error occurred while posting user' });
    }
});



exports.postUser = asyncHandler(async (req, res) => {
    const { name, phone, password, height, weight, dateOfBirth, blood, email, modeOfPayment, planId, planName, amount, duration} = req.body; 
    const image = req.file ? req.file.filename : undefined;
    
    try {
        // Validate inputs
        if (!name || !phone || !password || !height || !weight || !dateOfBirth || !blood || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if the phone number already exists
        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: "Phone number already exists" });
        }
        const expiryDate = moment().add(duration, 'months').toDate();
        
        // Create the user
        const newUser = await userModel.create({
            image,
            name,
            phone,
            password,
            height,
            weight,
            dateOfBirth,
            blood,
            email,
            authenticate: true,
        });
        const newPlanOrder = await plandOrderModel.create({
            userId: newUser._id,
            plandId: planId,
            name: planName,
            amount: amount,
            duration: duration,
            expiryDate: expiryDate,
            modeOfPayment: modeOfPayment,
            userName: name,
            activeStatus:'Active',
            showUser:true
        })
        
        // Log the successful creation
        console.log("New user created:", newUser, newPlanOrder);

        // Respond with success message and the created user
        res.status(200).json({
            message: 'User posted successfully',
            user: newUser
        });
        
    } catch (err) {
        // Log the error
        console.error("Error posting user:", err);

        // Respond with a generic error message
        res.status(500).json({ message: 'An error occurred while posting user' });
    }
});


exports.createUser = asyncHandler(async (req, res) => {
    const { name, phone, password, height, weight, dateOfBirth, blood, email, modeOfPayment, planId, planName, amount, duration} = req.body; 
    const image = req.file ? req.file.filename : undefined;
    
    try {
        // Validate inputs
        if (!name || !phone || !password || !height || !weight || !dateOfBirth || !blood || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if the phone number already exists
        const existingUser = await userModel.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ message: "Phone number already exists" });
        }
        const expiryDate = moment().add(duration, 'months').toDate();
        
        // Create the user
        const newUser = await userModel.create({
            image,
            name,
            phone,
            password,
            height,
            weight,
            dateOfBirth,
            blood,
            email,
            // expiryDate,
            // duration,
            // amount,
            // planName,
            // planId,
            // modeOfPayment,
            // activeStatus:"Active",
            // authenticate: true,
        });
        const newPlanOrder = await plandOrderModel.create({
            userId: newUser._id,
            plandId: planId,
            name: planName,
            amount: amount,
            duration: duration,
            expiryDate: expiryDate,
            modeOfPayment: modeOfPayment,
            userName: name,
            activeStatus:'Pending'
        })
        
        // Log the successful creation
        console.log("New user created:", newUser, newPlanOrder);

        // Respond with success message and the created user
        res.status(200).json({
            message: 'User posted successfully',
            user: newUser
        });
        
    } catch (err) {
        // Log the error
        console.error("Error posting user:", err);

        // Respond with a generic error message
        res.status(500).json({ message: 'An error occurred while posting user' });
    }
});





exports.userPostSignIn = asyncHandler(async(req, res) => {
    const { phone, password } = req.body;
    console.log(req.body,"the body is here")
    
    try {
        const postSignin = await userModel.findOne({ phone });

        if (!postSignin) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        if (!postSignin.authenticate) {
            return res.status(403).json({ error: "User is not authenticated" });
        }
        const isPasswordMatch = await bcrypt.compare(password, postSignin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid phone number or password" });
        }

        const token = jwt.sign({ email: postSignin.email }, "myjwtsecretkey");

        // Update the admin document in the database to save the token
        await userModel.findByIdAndUpdate(postSignin._id, { token: token });

        const userProfile = {
            id: postSignin._id,
            name: postSignin.name,
            email: postSignin.email,
            phone: postSignin.phone,
            image: postSignin.image,
            blood: postSignin.blood,
            height: postSignin.height,
            weight: postSignin.weight,
            dateOfBirth: postSignin.dateOfBirth,
            planId: postSignin.planId,
            planName: postSignin.planName,
            amount: postSignin.amount,
            duration: postSignin.duration,
            expiryDate: postSignin.expiryDate,
            activeStatus: postSignin.activeStatus,
        };
        console.log(postSignin.image, " the image is ")

        res.status(200).json({ token: token, user: userProfile });
        console.log(token,'the token is here')
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



exports.getUser = async (req, res) => {
    const search = req.query.search || '';
    try {
      const query = { 
        revealed: false,
        name: { $regex: search, $options: 'i' }
      };
      const response = await userModel.find(query);
      res.status(200).json(response);
    } catch (err) {
      console.error(err); 
      res.status(500).send('An error occurred while fetching data');
    }
  };
  


exports.getUserById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    // console.log(req.params, 'the id is here')
    try{
        const response = await userModel.findById(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.editUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {name, phone, height, weight, dateOfBirth, blood, email} = req.body;
    const image = req.file ? req.file.filename : undefined;
    try{  
        const update = {
            image:image, 
            name:name,
            phone:phone,
            height:height,
            weight:weight,
            dateOfBirth:dateOfBirth,
            blood:blood,
            email:email
        }
        const updateData = await userModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})

exports.deleteUser = asyncHandler(async(req, res)=>{
    const {id} = req.params
    try{
        const response = await userModel.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
    }
})

exports.revealUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
       const user =  await userModel.findById(id)
       user.revealed = true
       await user.save()
       res.status(200).send('success')
    }catch(err){
        console.log(err)
    }
})

exports.unrevealUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
       const user =  await userModel.findById(id)
       user.revealed = false
       await user.save()
       res.status(200).send('success')
    }catch(err){
        console.log(err)
    }
})


exports.getrevealedUser = asyncHandler(async(req,res)=>{
    try{
       const user =  await userModel.find({revealed:true})
       res.send(user)
       console.log(user,'the user is this')
    }catch(err){
        console.log(err)
    }
})


exports.changepassword = asyncHandler(async(req, res)=>{
    const {id} = req.params
   
    const {oldPassword , newPassword, cPassword} = req.body;

    try {
        const changePasswrod = await userModel.findById(id)
        const passwordMatch = await bcrypt.compare(oldPassword, changePasswrod.password)
       
       
        if(!passwordMatch){
            res.status(403).json({message:"The current password is not exist"})
        }else if(newPassword === cPassword){

            changePasswrod.password = cPassword;
            const updateUser = await changePasswrod.save();
            res.status(200).json({message:'password has been changed',updateUser});

        }else{
            res.status(400).json({message:'Confirm password is incorrect'})
        }
    }catch(err){
        console.log(err)
    }
})