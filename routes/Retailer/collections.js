const router = require('express').Router({mergeParams: true});

const collections = require('../../controllers/collections');

router.get('/', collections.readAll);

router.get('/:_id', collections.readById);

module.exports = router;