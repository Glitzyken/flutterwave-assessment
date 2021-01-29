const sendRequiredResponse = (res, field) => {
  res.status(400).json({
    message: `${field} is required.`,
    status: 'error',
    data: null,
  });
};

const sendTypeErrorMessage = (res, message) => {
  res.status(400).json({
    message,
    status: 'error',
    data: null,
  });
};

const sendSuccessResponse = (
  res,
  field,
  fieldVal,
  condition,
  condition_value
) => {
  res.status(200).json({
    message: `field ${field} successfully validated.`,
    status: 'success',
    data: {
      validation: {
        error: false,
        field,
        field_value: fieldVal,
        condition: condition,
        condition_value: condition_value,
      },
    },
  });
};

const sendFailResponse = (res, field, fieldVal, condition, condition_value) => {
  res.status(400).json({
    message: `field ${field} failed validation.`,
    status: 'error',
    data: {
      validation: {
        error: true,
        field,
        field_value: fieldVal,
        condition: condition,
        condition_value: condition_value,
      },
    },
  });
};

const sendMissingDataError = (res, field) => {
  res.status(400).json({
    message: `field ${field} is missing from data.`,
    status: 'error',
    data: null,
  });
};

exports.validatePayload = (req, res, next) => {
  const body = req.body;

  // Require required fields
  // - for Rule object and properties
  if (!body.rule) {
    sendRequiredResponse(res, 'rule');
    return;
  }
  if (!body.rule.field) {
    sendRequiredResponse(res, 'rule.field');
    return;
  }
  if (!body.rule.condition) {
    sendRequiredResponse(res, 'rule.condition');
    return;
  }
  if (!body.rule.condition_value) {
    sendRequiredResponse(res, 'rule.condition_value');
    return;
  }

  // - for Data object
  if (!body.data) {
    sendRequiredResponse(res, 'data');
    return;
  }

  // Check data types
  if (typeof body.rule != 'object') {
    sendTypeErrorMessage(res, 'rule should be an object.');
    return;
  }

  if (typeof body.rule.field != 'string') {
    sendTypeErrorMessage(res, 'rule.field should be a string.');
    return;
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
    return;
  }

  // if everything is ok, move on to the next middleware
  next();
};

exports.evaluateDataAndSendResult = (req, res) => {
  let field = req.body.rule.field;
  let data;

  const dataObj = req.body.data;

  const condition = req.body.rule.condition;
  const condition_value = req.body.rule.condition_value;

  if (field.includes('.')) {
    propList = field.split('.');
    field = propList[0];

    if (propList.length === 2) {
      for (const property in dataObj) {
        if (field === property) {
          data = dataObj[property][propList[1]];
        }
      }
    } else if (propList.length === 3) {
      for (const property in dataObj) {
        if (field === property) {
          data = dataObj[property][propList[1]][propList[2]];
        }
      }
    }
  } else if (data === field) {
    data = field;
  } else if (Array.isArray(data)) {
    data = data.find((el) => el === field);
  }

  // Evaluate Data and send correct response
  if (
    condition === 'eq' &&
    typeof condition_value == 'number' &&
    data !== undefined
  ) {
    if (parseInt(data) === condition_value) {
      sendSuccessResponse(res, field, data, condition, condition_value);
    } else {
      sendFailResponse(res, field, data, condition, condition_value);
    }
  } else if (
    condition === 'neq' &&
    typeof condition_value == 'number' &&
    data !== undefined
  ) {
    if (parseInt(data) !== condition_value) {
      sendSuccessResponse(res, field, data, condition, condition_value);
    } else {
      sendFailResponse(res, field, data, condition, condition_value);
    }
  } else if (
    condition === 'gt' &&
    typeof condition_value == 'number' &&
    data !== undefined
  ) {
    if (parseInt(data) > condition_value) {
      sendSuccessResponse(res, field, data, condition, condition_value);
    } else {
      sendFailResponse(res, field, data, condition, condition_value);
    }
  } else if (
    condition === 'gte' &&
    typeof condition_value == 'number' &&
    data !== undefined
  ) {
    if (parseInt(data) >= condition_value) {
      sendSuccessResponse(res, field, data, condition, condition_value);
    } else {
      sendFailResponse(res, field, data, condition, condition_value);
    }
  } else if (
    condition === 'contains' &&
    typeof condition_value == 'string' &&
    data !== undefined
  ) {
    if (data.includes(condition_value)) {
      sendSuccessResponse(res, field, data, condition, condition_value);
    } else {
      sendFailResponse(res, field, data, condition, condition_value);
    }
  } else {
    sendMissingDataError(res, field);
    return;
  }
};
