const router = require('express').Router({mergeParams: true});

const brands = require('../../controllers/brands');

router.get('/', brands.readAll);

router.get('/:_id', brands.readById);

module.exports = router;