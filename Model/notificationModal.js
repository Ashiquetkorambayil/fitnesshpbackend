const mongoose = require('mongoose');

const notificationModel = new mongoose.Schema({
    name:{type:String},
    image:{type:String},
    createdAt:{ type: Date, default: Date.now },
    amount:{type:Number},
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'plandOrderData'},
    pendingPlan:{type:Boolean, default:false}
})



const notificationData = mongoose.model('notificationData',notificationModel)
module.exports = notificationData