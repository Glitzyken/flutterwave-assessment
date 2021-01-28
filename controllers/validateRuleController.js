const sendRequiredResponse = (res, field) => {
  return res.status(400).json({
    message: `${field} is required.`,
    status: 'error',
    data: null,
  });
};

const sendTypeErrorMessage = (res, message) => {
  return res.status(400).json({
    message,
    status: 'error',
    data: null,
  });
};

const requireFields = (res, body) => {
  // For Rule object and properties
  if (!body.rule) {
    sendRequiredResponse(res, 'rule');
  }
  if (!body.rule.field) {
    sendRequiredResponse(res, 'rule.field');
  }
  if (!body.rule.condition) {
    sendRequiredResponse(res, 'rule.condition');
  }
  if (!body.rule.condition_value) {
    sendRequiredResponse(res, 'rule.condition_value');
  }

  // For Data object
  if (!body.data) {
    sendRequiredResponse(res, 'data');
  }
};

const checkDataTypes = (res, body) => {
  if (typeof body.rule != 'object') {
    sendTypeErrorMessage(res, 'rule should be an object.');
  }

  if (typeof body.rule.field != 'string') {
    sendTypeErrorMessage(res, 'rule.field should be a string.');
  }
  if (
    body.rule.condition === 'eq' ||
    body.rule.condition === 'neq' ||
    body.rule.condition === 'gt' ||
    body.rule.condition === 'gte' ||
    body.rule.condition === 'contains'
  ) {
    console.log(`rule.condition is ${body.rule.condition}.`);
  } else {
    sendTypeErrorMessage(
      res,
      'rule.condition should be either eq, neq, gt, gte or contains.'
    );
  }
};

exports.validatePayload = (req, res, next) => {
  const body = req.body;

  requireFields(res, body);
  checkDataTypes(res, body);

  // if everything is ok, move on to the next middleware
  next();
};

exports.sendResult = (req, res) => {
  const payload = req.body;

  res.status(200).json({
    status: 'success',
    data: {
      payload,
    },
  });
};
