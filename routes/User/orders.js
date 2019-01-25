const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const orders = require('../../controllers/User/orders');

router.post('/', passport.authenticate('jwt-user', {session: false}), orders.create);

router.post('/guest/', orders.create);

router.get('/:_id', passport.authenticate('jwt-user', {session: false}), orders.readByIdOrOrderNumber);

module.exports = router;
