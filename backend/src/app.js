require('dotenv').config(); // must be first line
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const compression   = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');

const { connectDB }      = require('./config/db');
const authRoutes         = require('./routes/auth.routes');
const tripRoutes         = require('./routes/trip.routes');
const expenseRoutes      = require('./routes/expense.routes');
const notificationRoutes = require('./routes/notification.routes');
const weatherRoutes      = require('./routes/weather.routes');
const { errorHandler }   = require('./middleware/error.middleware');
const { rateLimiter }    = require('./middleware/rateLimiter.middleware');

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('dev'));
app.use(rateLimiter);

app.use('/api/auth',          authRoutes);
app.use('/api/trips',         tripRoutes);
app.use('/api/expenses',      expenseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/weather',       weatherRoutes);

app.get('/health', (_req, res) =>
  res.json({ status: 'OK', uptime: process.uptime() })
);
app.use(errorHandler);

module.exports = app;