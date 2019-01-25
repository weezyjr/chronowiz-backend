const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const order = require('../../controllers/Admin/orders');

router.get('/', passport.authenticate('jwt-admin', {session: false}), order.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), order.readByIdOrOrderNumber);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), order.updateById);

module.exports = router;
