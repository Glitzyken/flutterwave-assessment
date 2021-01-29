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

res.status(200).json({
  message: `field ${data} successfully validated.`,
  status: 'success',
  data: {
    validation: {
      error: false,
      field: '[name of field]',
      field_value: '[value of field]',
      condition: '[rule condition]',
      condition_value: '[condition value]',
    },
  },
});
if (data === undefined) {
  console.log('data is undefined.');
}
return res.status(400).json({
  message: 'field [name of field] is missing from data.',
  status: 'error',
  data: null,
});
