const { response } = require('express');
const express = require('express');

const validateRuleController = require('../controllers/validateRuleController');

const router = express.Router();

router.post(
  '/',
  validateRuleController.validateRule,
  validateRuleController.validatedata,
  validateRuleController.sendRule
);

module.exports = router;
