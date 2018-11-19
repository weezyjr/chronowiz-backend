const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const collections = require('../../controllers/Admin/collections');

router.post('/', passport.authenticate('jwt-admin', {session: false}), collections.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), collections.readAll);

module.exports = router;