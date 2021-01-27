exports.validateRule = (req, res, next) => {
  console.log('The RULE fields are required');
  next();
};

exports.validatedata = (req, res, next) => {
  console.log('The DATA fields are required');
  next();
};

exports.sendRule = (req, res) => {
  const payload = req.body;

  console.log(payload.rule.field);

  res.status(200).json({
    status: 'success',
    data: {
      payload,
    },
  });
};
