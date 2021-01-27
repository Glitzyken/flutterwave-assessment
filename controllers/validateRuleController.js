exports.getSomething = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      name: 'Kenneth Omonigho Jimmy',
    },
  });
};
