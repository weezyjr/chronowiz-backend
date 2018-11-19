const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const brands = require('../../controllers/Admin/brands');

router.post('/', passport.authenticate('jwt-admin', {session: false}), brands.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), brands.readAll);

module.exports = router;