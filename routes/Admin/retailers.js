const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const retailers = require('../../controllers/retailers');

router.post('/', passport.authenticate('jwt-admin', {session: false}), retailers.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), retailers.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.readByIdOrEmail);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.updateById);

router.delete('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.deleteById);

router.put('/brandMaxDiscount/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.addOrUpdateRetailerMaximumBrandDiscount);

router.put('/collectionMaxDiscount/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.addOrUpdateRetailerMaximumCollectionDiscount);

router.put('/watchMaxDiscount/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.addOrUpdateRetailerMaximumWatchDiscount);

module.exports = router;