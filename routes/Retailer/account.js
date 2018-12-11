const router = require('express').Router();
const account = require('../../controllers/Retailer/account');

router.post('/login', account.login);

module.exports = router;