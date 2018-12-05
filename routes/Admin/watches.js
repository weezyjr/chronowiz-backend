const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const watches = require('../../controllers/watches');

router.post('/', passport.authenticate('jwt-admin', {session: false}), watches.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), watches.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), watches.readByIdOrReference);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), watches.updateById);

// router.delete('/:_id', passport.authenticate('jwt-admin', {session: false}), watches.deleteById);

module.exports = router;