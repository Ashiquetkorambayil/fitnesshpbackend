const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userModel = new mongoose.Schema({
    name:{type:String, required:true},
    image:{type:String},
    phone:{type:Number, required:true},
    password:{type:String, required:true},
    height:{type:String, required:true},
    weight:{type:String, required:true},
    dateOfBirth:{type:String, required:true},
    blood:{type:String, required:true},
    email:{type:String, required:true},
    idProof:{type:String, required: true},
    address:{type:String, required:true},
    plan:{type:String},
    token:{type: String},
    revealed:{type:Boolean, default:false},
    authenticate:{type:Boolean, default:false},
    createdAt:{ type: Date, default: Date.now }
})

userModel.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      // Only hash the password if it's not already hashed
      if (!this.password.startsWith('$2b$')) {
        try {
          const hashedPassword = await bcrypt.hash(this.password, 10);
          this.password = hashedPassword;
          next();
        } catch (error) {
          return next(error);
        }
      } else {
        return next();
      }
    } else {
      return next();
    }
  });

const userData = mongoose.model('userData', userModel)

module.exports = userData