const router = require('express').Router();
const account = require('../../controllers/User/account');

router.post('/login', account.login);

module.exports = router;