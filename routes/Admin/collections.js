const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const collections = require('../../controllers/collections');

router.post('/', passport.authenticate('jwt-admin', {session: false}), collections.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), collections.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), collections.readById);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), collections.updateById);

// router.delete('/:_id', passport.authenticate('jwt-admin', {session: false}), collections.deleteById);

module.exports = router;