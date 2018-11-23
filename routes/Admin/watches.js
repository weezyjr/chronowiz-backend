const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const watches = require('../../controllers/Admin/watches');

router.post('/', passport.authenticate('jwt-admin', {session: false}), watches.create);

router.get('/', watches.readAll);

module.exports = router;