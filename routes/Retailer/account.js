const router = require('express').Router();
const account = require('../../controllers/Retailer/account');
const passport = require('passport');

router.post('/login', account.login);

router.get('/profile', passport.authenticate('jwt-retailer', {session: false}), account.profile);

module.exports = router;