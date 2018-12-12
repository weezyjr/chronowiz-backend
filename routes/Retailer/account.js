const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/Retailer/account');

router.post('/login', account.login);

router.get('/profile', passport.authenticate('jwt-retailer', {session: false}), account.profile);

module.exports = router;