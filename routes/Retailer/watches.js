const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const watches = require('../../controllers/watches');
const retailerWatches = require('../../controllers/Retailer/retailerWatches');

router.get('/', passport.authenticate('jwt-retailer', {session: false}), watches.readAll);

router.get('/:_id', passport.authenticate('jwt-retailer', {session: false}), watches.readByIdOrReference);

router.put('/AddToStockById/:_id/', passport.authenticate('jwt-retailer', {session: false}), retailerWatches.AddToStockById);

router.delete('/RemoveFromStockById/:_id/', passport.authenticate('jwt-retailer', {session: false}), retailerWatches.RemoveFromStockById);

router.put('/UpdateRetailerWatchDiscount/:_id/', passport.authenticate('jwt-retailer', {session: false}), retailerWatches.UpdateRetailerWatchDiscount);

module.exports = router;