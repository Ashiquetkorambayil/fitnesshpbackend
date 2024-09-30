const adminModel = require('../Model/adminModel');
const staffModel = require('../Model/staffModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.postadmin = asyncHandler(async(req, res)=>{
    const {name, email, phone, role, password}= req.body
    const image = req.file ? req.file.filename : undefined;
    try{
        const postAdmin = await adminModel.create({

            name:name,
            email:email,
            phone:phone,
            role:role,
            image:image,
            password:password
        })
        res.json(postAdmin)
           
    }catch(err){
        console.log(err)
    }
})



exports.postsignin = asyncHandler(async (req, res) => {
    const { email, phoneNumber, password } = req.body;
  
    try {
      let user;
      let role;
      let tokenField;
  
      if (email) {
        user = await adminModel.findOne({ email });
        role = "admin";
        tokenField = "tokens";
      } else if (phoneNumber) {
        user = await staffModel.findOne({ phoneNumber });
        role = "staff";
        tokenField = "staffToken";
      }
  
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      let token;
      if (role === "admin") {
        token = jwt.sign({ id: user._id, role: role }, "myjwtsecretkey");
        await adminModel.findByIdAndUpdate(user._id, { [tokenField]: token });
      } else if (role === "staff") {
        token = jwt.sign({ id: user._id, role: role }, "myjwtsecretkey");
        await staffModel.findByIdAndUpdate(user._id, { [tokenField]: token });
      }
  
      const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email || "",
        role: role,
        phone: user.phone || "",
        image: user.image || "",
      };
  
      res.status(200).json({ token: token, user: userProfile });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


exports.getAdmin = asyncHandler(async(req,res)=>{
    try{
        const getItems = await adminModel.find();
        res.status(200).json(getItems);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"an error occurred while fectching data"})
    }
})

exports.getAdminById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const response = await adminModel.findById(id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occured while fetching data')
    }
})

exports.editAdmin = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {name, phone, role, email} = req.body;
    const image = req.file ? req.file.filename : undefined;

    try{  
        const update = {
            image:image, 
            name:name,
            phone:phone,
            role:role,
            email:email
        }
        const updateData = await adminModel.findByIdAndUpdate(id, {$set:update}, {new:true})
        res.status(200).json(updateData)
       
    }catch(err){
        res.status(500).json({err:'error while updating data'})
    }
})

exports.adminChangepassword = asyncHandler(async(req, res)=>{
    const {id} = req.params
   
    const {oldPassword , newPassword, cPassword} = req.body;

    try {
        const changePasswrod = await adminModel.findById(id)
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