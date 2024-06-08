const axios = require('axios');
const crypto = require('crypto-js');
const asyncHandler = require('express-async-handler');
const paytmConfig = {
    mid: 'rmjKtI53331536757604',
    key: 'nCGgOY%n#h1SZR0C',
    website: 'WEBSTAGING',
    industryType: 'Retail',
    channelId: 'WEB'
};

exports.paytmPayment = asyncHandler(async (req, res) => {
    const { orderId, amount } = req.body;
    console.log(req.body, 'this is the body');
    const paytmParams = {
        MID: paytmConfig.mid,
        WEBSITE: paytmConfig.website,
        INDUSTRY_TYPE_ID: paytmConfig.industryType,
        CHANNEL_ID: paytmConfig.channelId,
        ORDER_ID: orderId,
        CUST_ID: 'customerId',
        TXN_AMOUNT: amount.toString(),
        CALLBACK_URL: 'http://localhost:3000/callback',
        EMAIL: 'customer@example.com',
        MOBILE_NO: '7777777777'
    };

    console.log(paytmParams, 'this is the paytm params');

    const checksum = generateChecksum(paytmParams, paytmConfig.key);
    paytmParams.CHECKSUMHASH = checksum;

    console.log(checksum, 'this is the checksum');

    try {
        const response = await axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${paytmConfig.mid}&orderId=${orderId}`, 
        {
            body: {
                requestType: 'Payment',
                mid: paytmConfig.mid,
                websiteName: paytmConfig.website,
                orderId: orderId,
                callbackUrl: 'http://localhost:3000/callback',
                txnAmount: {
                    value: amount.toString(),
                    currency: 'INR',
                },
                userInfo: {
                    custId: 'customerId',
                    email: 'customer@example.com',
                    mobile: '7777777777'
                }
            },
            head: {
                signature: checksum
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data, 'this is the full response from Paytm');
        
        if (response.data && response.data.body && response.data.body.txnToken) {
            res.json({ token: response.data.body.txnToken });
            console.log(response.data.body.txnToken, 'this is the response from backend');
        } else {
            throw new Error('Unable to get txnToken from Paytm response');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

const generateChecksum = (params, key) => {
    const sortedParams = Object.keys(params).sort().reduce((acc, curr) => {
        acc[curr] = params[curr];
        return acc;
    }, {});

    const data = Object.keys(sortedParams).reduce((acc, curr) => {
        acc += sortedParams[curr] + '|';
        return acc;
    }, '');

    const checksum = crypto.HmacSHA256(data, key).toString(crypto.enc.Hex);
    return checksum.toUpperCase();
};
