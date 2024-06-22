const mongoose = require('mongoose');

const campaignModel = new mongoose.Schema({
    name: { type: String, required: true },
    planIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'planData', required: true }],
    discountType: { type: String, enum: ['percentage', 'amount'], required: true },
    discountValue: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true }
});

const CampaignData = mongoose.model('CampaignData', campaignModel);
module.exports = CampaignData;
