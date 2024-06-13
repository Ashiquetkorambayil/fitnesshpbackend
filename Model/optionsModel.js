const mongoose = require('mongoose');
const optionsModel = new mongoose.Schema({
    options:{type:String, required:true},
})

const optionsData = mongoose.model("optionsData", optionsModel)
module.exports = optionsData