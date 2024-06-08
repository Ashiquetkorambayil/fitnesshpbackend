const asyncHandler = require('express-async-handler');
const pendingOrderModel = require('../Model/pendingOrders');
const plandOrderModel = require('../Model/plandOrderModel');
const moment = require('moment');

exports.postPendingOrder = asyncHandler(async(req,res)=>{
    const { userId, planId, name, amount, duration, userName, modeOfPayment } = req.body;
    console.log(req.body), 'the rusult'
    try{
      
        await pendingOrderModel.create({ userId, planId, name, amount, duration,modeOfPayment, userName});
        
        res.json({ message: 'User plan selected successfully' });
    } catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.getPendingOrder = asyncHandler(async(req,res)=>{
    try{
        const response = await pendingOrderModel.find()
        res.status(200).json(response)
        res.send('the pending order fetched successfully')
    }catch(err){
        console.log(err)
        res.status(500).send('error occured while fetching data')
    }
})



exports.updatePendingOrderStatus = asyncHandler(async (req, res) => {
    const { id, status } = req.body;
    try {
        const pendingOrder = await pendingOrderModel.findById(id);
        if (!pendingOrder) {
            return res.status(404).json({ error: 'Pending order not found' });
        }
        pendingOrder.activeStatus = status;
        await pendingOrder.save();

        if (status === 'Accepted') {
            // Create a plan order if the pending order is accepted
            const { userId, planId, name, amount, duration, userName, modeOfPayment } = pendingOrder;
            const expiryDate = moment().add(duration, 'months').toDate();
            await plandOrderModel.create({ userId, planId, name, amount, duration, expiryDate, modeOfPayment, userName });
        }else if (status === 'Rejected'){
            await pendingOrderModel.findOneAndDelete(id)
            res.status(200).send('the items is deletd successfully')
        }

        res.json({ message: `Order ${status.toLowerCase()} successfully` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});