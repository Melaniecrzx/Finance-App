const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const authRouter = require('./routes/authRoutes.js');
const transactionRouter = require('./routes/transactionRoutes.js');
const budgetRouter = require('./routes/budgetRoutes.js');
const potRouter = require('./routes/potRoutes.js');
const overviewRouter = require('./routes/overviewRoutes.js');
const billRouter = require('./routes/billRoutes.js');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://finance-app-melaniecrzx.vercel.app',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 1) Middlewares
// security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
if (process.env.NODE_ENV !== 'development') {
  app.use('/api', limiter);
}

//body parser, reading from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/budgets', budgetRouter);
app.use('/api/v1/pots', potRouter);
app.use('/api/v1/overview', overviewRouter);
app.use('/api/v1/bills', billRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: ' API is running', app: 'Finance' });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
