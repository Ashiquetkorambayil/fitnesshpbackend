const mongoose = require('mongoose');

const notificationModel = new mongoose.Schema({
    name:{type:String},
    image:{type:String},
    createdAt:{ type: Date, default: Date.now }
})



const notificationData = mongoose.model('notificationData',notificationModel)
module.exports = notificationData