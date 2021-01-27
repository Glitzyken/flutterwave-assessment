const express = require('express');

const validateRuleController = require('../controllers/validateRuleController');

const router = express.Router();

router.get('/', validateRuleController.getSomething);

module.exports = router;
