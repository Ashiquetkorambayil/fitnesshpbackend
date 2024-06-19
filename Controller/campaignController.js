// const mongoose = require('mongoose');
const PlanModel = require('../Model/planModel');
const asyncHandler = require('express-async-handler')
const CampaignModel = require('../Model/campaignModel');

const applyDiscount = (amount, discountType, discountValue) => {
    if (discountType === 'percentage') {
        return amount * (1 - discountValue / 100);
    } else if (discountType === 'amount') {
        return amount - discountValue;
    }
    return amount;
};

exports.createCampaign = asyncHandler(async(req,res) => {
    const {name, planIds, discountType, discountValue} = req.body
    try {
        // Update plans with the discount
        const plans = await PlanModel.find({ _id: { $in: planIds } });
        for (const plan of plans) {
            plan.amountBeforeDiscount = plan.amount;
            plan.amount = applyDiscount(plan.amount, discountType, discountValue);
            await plan.save();
        }

        // Create the campaign
        const campaign = new CampaignModel({ name, planIds, discountType, discountValue });
        await campaign.save();

        console.log('Campaign created and discount applied successfully');
        res.send(200).send('Campaign created and discount applied successfully')
    } catch (error) {
        console.error('Error creating campaign:', error);
    }
});

exports.getCampaign = asyncHandler(async(req,res)=>{
    try {
        const response = await CampaignModel.find()
        res.status(200).json(response)
    } catch (error) {
        consolel.log(error)
        res.status(500).send('an error occured while fetching the data')
    }
});

exports.deleteCampaign = asyncHandler(async (req,res) => {
    const {id} =req.params
    try {
        const campaign = await CampaignModel.findById(id);

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const planIds = campaign.planIds;

        // Remove discounts from the plans
        const plans = await PlanModel.find({ _id: { $in: planIds } });

        for (const plan of plans) {
            if (plan.amountBeforeDiscount !== undefined) {
                plan.amount = plan.amountBeforeDiscount;
                plan.amountBeforeDiscount = undefined; // Clear the backup field
                await plan.save();
            }
        }

        // Delete the campaign
        await CampaignModel.findByIdAndDelete(id);
         res.status(200).send('item deleted successfully')
        console.log('Campaign deleted and discount removed successfully');
    } catch (error) {
        console.error('Error deleting campaign:', error);
    }
});
