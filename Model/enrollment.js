const mongoose = require('mongoose');
const enrollmentModel = new mongoose.Schema({
    amount:{type:Number, required:true},
})

const enrollmentData = mongoose.model("enrollmentData", enrollmentModel)
module.exports = enrollmentData