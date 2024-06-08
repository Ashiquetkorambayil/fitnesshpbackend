const express = require('express');
const router = express.Router();
const paytmController = require('../Controller/paytmController');

router.post('/generate-checksum', paytmController.generateChecksum);
router.post('/initiate-transaction', paytmController.initiateTransaction);

module.exports = router;
