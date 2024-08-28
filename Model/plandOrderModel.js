const mongoose = require('mongoose');
const planOrderModel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userData' },
    userName: { type: String },
    modeOfPayment: { type: String },
    planId: { type: String },
    name: { type: String },
    amount: { type: Number },
    duration: { type: Number },
    selectedAt: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    activeStatus: { type: String, enum: ["Active", "Expired", "Nearly Expire","Pending", "Rejected", "Paused"]},
    status: { type: String, enum: ['No plan yet', 'New join', 'Renewal'] },
    buddyPlanMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userData' }],
    activedBuddyPlanMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userData' }],
    show:{type:Boolean, default: true},
    showUser:{type:Boolean, default:false},
    buddyPlan:{type:Boolean, default:false},
    admin:{ type: mongoose.Schema.Types.ObjectId, ref: 'userData'},
    pauseDate: { type: Date, default: null },
    remainingDays: { type: Number, default: null }
});

const plandOrderData = mongoose.model("plandOrderData", planOrderModel)
module.exports = plandOrderData