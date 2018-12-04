const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/account');

router.post('/signup', passport.authenticate('jwt-admin', {session: false}), account.signup);

router.post('/login', account.login);

module.exports = router;