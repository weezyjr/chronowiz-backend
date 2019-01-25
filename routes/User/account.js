const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/User/account');

router.post('/signup', account.signup);

router.post('/login', account.login);

router.get('/profile', passport.authenticate('jwt-user', {session: false}), account.profile);

router.put('/update', passport.authenticate('jwt-user', {session: false}), account.update);

router.post('/resetPasswordSendEmail', account.resetPasswordSendEmail);

router.post('/resetPasswordConfirmCode', account.resetPasswordConfirmCode);

router.post('/resetPasswordNewPassword', passport.authenticate('jwt-user', {session: false}), account.resetPasswordNewPassword);

router.post('/contactus', account.contactus);

module.exports = router;
