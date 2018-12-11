const router = require('express').Router({mergeParams: true});

const watches = require('../../controllers/watches');

router.get('/', watches.readAll);

router.get('/:_id', watches.readByIdOrReference);

module.exports = router;