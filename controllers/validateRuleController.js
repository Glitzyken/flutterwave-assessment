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

exports.evaluateDataAndSendResult = (req, res, next) => {
  let field = req.body.rule.field;
  let data = req.body.data;

  const condition = req.body.rule.condition;
  const condition_value = req.body.rule.condition_value;

  if (field.includes('.')) {
    propList = field.split('.');
    field = propList[0];

    if (propList.length === 2) {
      for (const property in data) {
        if (field === property) {
          console.log(`Match! 😃 at ${property}`);
          data = data[property][propList[1]];
          console.log(data);
        }
      }
    } else if (propList.length === 3) {
      for (const property in data) {
        if (field === property) {
          console.log(`Match! 😃 at ${property}`);
          data = data[property][propList[1]][propList[2]];
          console.log(data);
        }
      }
    }
  } else if (data === field) {
    data = field;
    console.log(data);
  } else if (Array.isArray(data)) {
    data = data.find((el) => el === field);
    console.log(data);
  }

  // Evaluate Data and send correct response
  if (condition === 'eq' && typeof condition_value == 'number') {
    // do this...
    if (parseInt(data) == condition_value) {
      console.log('Data is equal to the condition value. ✔');
    } else {
      console.log('Data is not equal to the condition value. ❗');
    }
  } else if (condition === 'neq' && typeof condition_value == 'number') {
    // do this...
  } else if (condition === 'gt' && typeof condition_value == 'number') {
    // do this...
  } else if (condition === 'gte' && typeof condition_value == 'number') {
    // do this...
  } else if (condition === 'contains' && typeof condition_value == 'string') {
    if (data.includes(condition_value)) {
      console.log(`${data} contains ${condition_value}. ✔`);
    } else {
      console.log(`${data} does not contain ${condition_value}. ❗`);
    }
  }

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
