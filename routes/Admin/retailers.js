const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const retailers = require('../../controllers/Admin/retailers');

router.post('/', passport.authenticate('jwt-admin', {session: false}), retailers.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), retailers.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.readByIdOrEmail);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.updateById);

router.delete('/:_id', passport.authenticate('jwt-admin', {session: false}), retailers.deleteById);

module.exports = router;