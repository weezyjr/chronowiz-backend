const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const users = require('../../controllers/Admin/users');

router.get('/', passport.authenticate('jwt-admin', {session: false}), users.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), users.readByIdOrEmail);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), users.updateById);

module.exports = router;
