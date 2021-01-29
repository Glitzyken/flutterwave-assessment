const express = require('express');

const validateRuleController = require('../controllers/validateRuleController');

const router = express.Router();

router.post(
  '/',
  validateRuleController.validatePayload,
  validateRuleController.evaluateDataAndSendResult,
  validateRuleController.sendResult
);

module.exports = router;
