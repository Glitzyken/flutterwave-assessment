if (typeof body.rule.condition_value != 'number') {
  return res.status(400).json({
    message: 'rule.condition_value should be a number.',
    status: 'error',
    data: null,
  });
}

// For Data object
if (typeof body.data.name != 'string') {
  return res.status(400).json({
    message: 'data.name should be a string.',
    status: 'error',
    data: null,
  });
}

if (typeof body.data != 'object') {
  return res.status(400).json({
    message: 'data should be a string or an object or array.',
    status: 'error',
    data: null,
  });
}

// console.log(`${property}: ${data[property]}`);
