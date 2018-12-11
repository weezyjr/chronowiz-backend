const router = require('express').Router({mergeParams: true});
const passport = require('passport');
const collections = require('../../controllers/collections');

router.get('/', passport.authenticate('jwt-retailer', {session: false}), collections.readAll);

router.get('/:_id', passport.authenticate('jwt-retailer', {session: false}), collections.readById);

module.exports = router;