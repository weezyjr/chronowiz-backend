const router = require('express').Router({mergeParams: true});
const passport = require('passport');

const brands = require('../../controllers/brands');

// /api/admin/brands

router.post('/', passport.authenticate('jwt-admin', {session: false}), brands.create);

router.get('/', passport.authenticate('jwt-admin', {session: false}), brands.readAll);

router.get('/:_id', passport.authenticate('jwt-admin', {session: false}), brands.readByIdOrName);

router.put('/:_id', passport.authenticate('jwt-admin', {session: false}), brands.updateById);

router.delete('/:_id', passport.authenticate('jwt-admin', {session: false}), brands.deleteById);

module.exports = router;