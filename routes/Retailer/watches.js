const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const watches = require('../../controllers/watches');

router.get('/', passport.authenticate('jwt-retailer', {session: false}), watches.readAll);

router.get('/:_id', passport.authenticate('jwt-retailer', {session: false}), watches.readByIdOrReference);

router.put('/:_id', passport.authenticate('jwt-retailer', {session: false}), watches.AddToStockById);

router.delete('/:_id', passport.authenticate('jwt-retailer', {session: false}), watches.RemoveFromStockById);

module.exports = router;