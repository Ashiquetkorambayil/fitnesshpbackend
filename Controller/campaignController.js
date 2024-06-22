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
    const { name, planIds, discountType, discountValue, expiryDate } = req.body;
    try {
        // Update plans with the discount
        const plans = await PlanModel.find({ _id: { $in: planIds } });
        for (const plan of plans) {
            plan.amountBeforeDiscount = plan.amount;
            plan.amount = applyDiscount(plan.amount, discountType, discountValue);
            await plan.save();
        }

        // Create the campaign
        const campaign = new CampaignModel({ name, planIds, discountType, discountValue, expiryDate });
        await campaign.save();

        console.log('Campaign created and discount applied successfully');
        res.status(200).send('Campaign created and discount applied successfully');
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).send('Error creating campaign');
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

exports.getCampaignzById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const response = await CampaignModel.findById(id)
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

exports.deleteExpiredCampaigns = async () => {
    try {
        const currentDate = new Date();
        const expiredCampaigns = await CampaignModel.find({ expiryDate: { $lte: currentDate } });

        for (const campaign of expiredCampaigns) {
            const planIds = campaign.planIds;
            const plans = await PlanModel.find({ _id: { $in: planIds } });

            for (const plan of plans) {
                if (plan.amountBeforeDiscount !== undefined) {
                    plan.amount = plan.amountBeforeDiscount;
                    plan.amountBeforeDiscount = undefined;
                    await plan.save();
                }
            }

            await CampaignModel.findByIdAndDelete(campaign._id);
        }

        console.log('Expired campaigns deleted and discounts removed successfully');
    } catch (error) {
        console.error('Error deleting expired campaigns:', error);
        throw error;
    }
};


exports.updateCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, planIds, discountType, discountValue, expiryDate } = req.body;
    console.log('Request body for campaign update:', req.body);

    try {
        const campaign = await CampaignModel.findById(id);
        if (!campaign) {
            return res.status(404).send('Campaign not found');
        }

        // Determine which plans are removed and which are added
        const existingPlanIds = campaign.planIds;
        const newPlanIds = planIds;
        const plansToRemove = existingPlanIds.filter(id => !newPlanIds.includes(id));
        const plansToAdd = newPlanIds.filter(id => !existingPlanIds.includes(id));

        // Revert discount for removed plans
        const plansToRevertDiscount = await PlanModel.find({ _id: { $in: plansToRemove } });
        for (const plan of plansToRevertDiscount) {
            if (plan.amountBeforeDiscount !== undefined) {
                plan.amount = plan.amountBeforeDiscount;
                plan.amountBeforeDiscount = undefined;
                await plan.save();
            }
        }

        // Apply discount to newly associated plans or update existing discounts
        const plansToUpdate = await PlanModel.find({ _id: { $in: newPlanIds } });
        for (const plan of plansToUpdate) {
            if (plan.amountBeforeDiscount === undefined) {
                plan.amountBeforeDiscount = plan.amount;
            }
            plan.amount = applyDiscount(plan.amountBeforeDiscount, discountType, discountValue);
            await plan.save();
        }

        // Update the campaign details
        campaign.name = name;
        campaign.planIds = newPlanIds;
        campaign.discountType = discountType;
        campaign.discountValue = discountValue;
        campaign.expiryDate = expiryDate;
        await campaign.save();

        console.log('Campaign updated successfully');
        res.status(200).send('Campaign updated successfully');
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).send('Error updating campaign');
    }
});