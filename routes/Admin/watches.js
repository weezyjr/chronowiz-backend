const router = require('express').Router({mergeParams: true});

const watches = require('../../controllers/Admin/watches');

router.post('/', watches.create);

router.get('/', watches.readAll);

module.exports = router;