const router = require('express').Router({mergeParams: true});
const passport = require('passport');
const brands = require('../../controllers/brands');

router.get('/', passport.authenticate('jwt-retailer', {session: false}), brands.readAll);

router.get('/:_id', passport.authenticate('jwt-retailer', {session: false}), brands.readByIdOrName);

module.exports = router;