const router = require('express').Router();
const passport = require('passport');

const account = require('../../controllers/Admin/account');

router.post('/signup', account.signup); //TODO add JWT

router.post('/login', account.login);

module.exports = router;