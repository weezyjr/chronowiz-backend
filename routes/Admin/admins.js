const router = require('express').Router();
const passport = require('passport');

const admins = require('../../controllers/admins');

router.post('/signup', passport.authenticate('jwt-admin', {session: false}), admins.signup);

router.post('/login', admins.login);

module.exports = router;