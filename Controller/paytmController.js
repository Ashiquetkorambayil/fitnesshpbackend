const PaytmChecksum = require('../utils/PaytmChecksum');
const axios = require('axios');

exports.generateChecksum = async (req, res) => {
  const paytmParams = req.body;
  const mkey = 'nCGgOY%n#h1SZR0C'; // Replace with your actual Merchant Key

  try {
    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams), mkey);
    res.json({ checksum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initiateTransaction = async (req, res) => {
  const { mid, orderId, checksum, paytmParams } = req.body;

  const options = {
    hostname: 'securegw-stage.paytm.in',
    port: 443,
    path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify({ head: { signature: checksum }, body: paytmParams }).length,
    },
  };

  const https = require('https');

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (e) => {
    res.status(500).json({ error: e.message });
  });

  request.write(JSON.stringify({ head: { signature: checksum }, body: paytmParams }));
  request.end();
};
