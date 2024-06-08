const crypto = require('crypto');

class PaytmChecksum {
  static generateSignature(params, key) {
    return new Promise((resolve, reject) => {
      let string = JSON.stringify(params);
      let salt = crypto.randomBytes(4).toString('hex');
      let hashString = crypto.createHmac('sha256', key + salt).update(string).digest('hex');
      resolve(hashString);
    });
  }
}

module.exports = PaytmChecksum;
