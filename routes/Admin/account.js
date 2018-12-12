const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/Admin/account');

router.post('/signup', passport.authenticate('jwt-admin', {session: false}), account.signup);

router.post('/login', account.login);

router.get('/profile', passport.authenticate('jwt-admin', {session: false}), account.profile);

module.exports = router;