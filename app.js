const express = require('express');
const morgan = require('morgan');

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
const validateRuleRouter = require('./routes/validateRuleRoute');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// ROUTES
app.use('/validate-rule', validateRuleRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Kenneth Omonigho Jimmy',
      github: '@glitzyken',
      email: 'kenjimmy17@gmail.com',
      mobile: '08133930845',
      twitter: '@glitzyken17',
    },
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(globalErrorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
