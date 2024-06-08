const mongoose = require('mongoose');
const pendingOrdersModel = new mongoose.Schema({
    userId: { type: String },
    userName: { type: String },
    modeOfPayment: { type: String },
    planId: { type: String },
    name: { type: String },
    amount: { type: Number },
    duration: { type: Number },
    requestedAt:{ type: Date, default: Date.now },
     activeStatus: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
});

const pendingOrdersData = mongoose.model("pendingOrdersData", pendingOrdersModel)
module.exports = pendingOrdersData