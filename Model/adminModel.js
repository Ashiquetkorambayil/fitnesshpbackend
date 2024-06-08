const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const adminModel = new mongoose.Schema({
    name:{type:String, required:true},
    image:{type:String},
    phone:{type:Number, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    role:{type:String, required:true},
    token:{type: String}
})

adminModel.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      // Only hash the password if it's not already hashed
      if (!this.password.startsWith('$2b$')) {
        try {
          const hashedPassword = await bcrypt.hash(this.password, 10);
          this.password = hashedPassword;

          if(this.isNew){
            const token = jwt.sign({email: this.email}, 'myjwtsecretkey');
            this.token = token;
          }

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

const adminData = mongoose.model('adminData',adminModel)
module.exports = adminData