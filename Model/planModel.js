const mongoose = require('mongoose');
const planModel = new mongoose.Schema({
    hour:{type:Number, required:true},
    amount:{type:Number, required:true},
    duration:{type:Number, required:true},
    description:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategoryData',
        required: true,
    },
    amountBeforeDiscount: { type: Number }
})

const planData = mongoose.model("planData", planModel)
module.exports = planData