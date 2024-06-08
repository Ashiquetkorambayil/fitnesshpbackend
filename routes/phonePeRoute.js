const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/phonepe/paymentController')
const PaytmChecksum = require('paytmchecksum')

const merchantId = 'rmjKtI53331536757604'
const key = 'nCGgOY%n#h1SZR0C'

router.post('/callback', async(req,res)=> {
    try {
        const {ORDERID, RESPMSG} = req.body
        
        var paytmChecksum = req.body.CHECKSUMHASH;
        delete req.body.CHECKSUMHASH;
        
        var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum); 

        if(isVerifySignature){
            console.log('checksum matched')
            if(req.body.STATUS === "TXN_SUCCESS"){
                return res.redirect(`/success?orderId=${ORDERID}&message${RESPMSG}`)
            }else{
                return res.redirect(`/failure?orderId=${ORDERID}&message${RESPMSG}`)
            }
        }else{
            console.log('checksum missmatched')
            return res.send('something went wrong')
        }
    } catch (error) {
        console.log(error)
    }
})



router.post('/payment', async(req,res)=>{
 const {amount, email} = req.body
 const totalAmount = JSON.stringify(amount);

 var orderId = `ORDERID_${Date.now()}`
 var custId = `CUST_${Date.now()}`
 var paytmParams = {};


//change while production-------------------
 (paytmParams["MID"] = merchantId),
 (paytmParams["WEBSITE"] = 'WEBSTAGING'),
 (paytmParams["CHANNEL_ID"] = 'WEB'),
 (paytmParams["INDUSTRY_TYPE_ID"] = 'Retail'),
 //change while production-------------------
 (paytmParams["ORDER_ID"] = orderId),
 (paytmParams["CUST_ID"] = custId),
 (paytmParams["TXN_AMOUNT"] = totalAmount),
 (paytmParams["CALLBACK_URL"] = `http://localhost:8000/api/callback`),
 (paytmParams["EMAIL"] = email),
 (paytmParams["MOBILE_NO"] = '8978675645');

 var paytmChecksum = PaytmChecksum.generateSignature(
    paytmParams,
    key
);
paytmChecksum.then(function(checksum){
    let params = {
        ...paytmParams,
        CHECKSUMHASH: checksum,
    };

    res.json(params)
    console.log("generateSignature Returns: " + checksum);
}).catch(function(error){
	console.log(error);
});

})



module.exports = router;