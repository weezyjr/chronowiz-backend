const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/User/account');

router.post('/signup', account.signup);

router.post('/login', account.login);

router.get('/profile', passport.authenticate('jwt-user', {session: false}), account.profile);

module.exports = router;