const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const transactionRouter = require('./routes/transactionRoutes.js');
const budgetRouter = require('./routes/budgetRoutes.js');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

// 1) Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/budgets', budgetRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res.status(200).json({ message: ' API is running', app: 'Finance' });
});

module.exports = app;
