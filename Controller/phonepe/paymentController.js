











































// const crypto = require('crypto');
// const axios = require('axios');
// const asynchHandler = require('express-async-handler');
// const uniqid = require('uniqid');
// const qs = require('qs');

// exports.newPayment = asynchHandler(async (req, res) => {
//     const { userId, phone, amount } = req.body;
//     // const backendUrl = 'http://localhost:8000';
//     const phonePeHostUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
//     const merchantId = 'PGTESTPAYUAT';
//     const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
//     const saltIndex = 1;
//     // const payEndpoint = '/pg/v1/pay';
//     const merchantTransactionId = uniqid();
  
// //     const data = {
// //       merchantId: merchantId,
// //       merchantTransactionId: merchantTransactionId,
// //       merchantUserId: userId,
// //       name: userName,
// //       amount: amount * 100, // amount in paise
// //       redirectUrl: `${backendUrl}/api/status/${merchantTransactionId}`,
// //       redirectMode: "REDIRECT",
// //       mobileNumber: phone,
// //       paymentInstrument: {
// //         type: "PAY_PAGE"
// //       }
// //     };

// const merChantJson = {
//     "merchantId": merchantId,
//     "merchantTransactionId": merchantTransactionId,
//     "merchantUserId": userId,
//     "amount": amount * 100,
//     "redirectUrl": `https://api-preprod.phonepe.com/apis/pg-sandbox/api/v1/phonepe-response`,
//     "redirectMode": "POST",
//     "mobileNumber": phone,
//     "paymentInstrument": {
//       "type": "PAY_PAGE"
//     }, 
//   }
  
// //     const bufferObj = Buffer.from(JSON.stringify(data), 'utf8');
// //     const base64EncodedPayload = bufferObj.toString('base64');
// //     const sha256 = crypto.createHash('sha256').update(base64EncodedPayload + payEndpoint + saltKey).digest('hex');
// //     const xVerify = sha256 + '###' + saltIndex;
  
// //     const url = `${phonePeHostUrl}${payEndpoint}`;
// //     console.log('URL:', url); // Log constructed URL

// function encodeJSONToBase64(obj){
//     const jsonString = JSON.stringify(obj);
//     const base64Encoded = Buffer.from(jsonString).toString('base64');
//     return base64Encoded;
//   }
//   const base64Encoded = encodeJSONToBase64(merChantJson);

//   const inputString = base64Encoded + "/pg/v1/pay" + saltKey;
//         const hash = crypto.createHash('sha256').update(inputString).digest('hex');
//         const finalHash = hash + "###" + saltIndex;
  
// //     const options = {
// //       method: 'post',
// //       url: url,
// //       headers: {
// //         accept: 'application/json', // Modified header
// //         'Content-Type': 'application/json',
// //         'X-VERIFY': xVerify,
// //       },
// //       data: {
// //         request: base64EncodedPayload
// //       }
// //     };
  
// //     try {
// //       const response = await axios.request(options);
// //       console.log(response.data);
// //       res.send(response.data);
// //     } catch (error) {
// //       console.log(error);
// //       res.status(500).json({ error: 'Payment processing failed' });
// //     }

// // const options = { 
// //     method: 'POST',
// //     url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
// //     headers: {
// //       accept: 'application/json',
// //       'Content-Type': 'application/json',
// //       'X-VERIFY': finalHash,
// //       'User-Agent': 'axios/1.7.2'
// //     },
// //     data: {
// //       request: base64Encoded
// //     }
// //   };



// const options = {
//   method: 'POST',
//   url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'User-Agent': 'axios/1.7.2'
//   },
//   data: qs.stringify({
//     request: base64Encoded
//   })
// };
  
//   axios(options)
//     .then(response => {
//       console.log(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });

//   axios
//   .post(options)
//   .then(function (response) {
//    res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
//     res.status(200).json({
//       status: 'success',
//       body: response.data
//     })
//   })
//   .catch(function (error) {
//     console.error('error', error);
//   });

//   });
  
