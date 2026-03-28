require('dotenv').config();
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
const itineraryRoutes    = require('./routes/itinerary.routes');
const chatbotRoutes      = require('./routes/chatbot.routes');
const translatorRoutes   = require('./routes/translator.routes');
const mapsRoutes         = require('./routes/maps.routes');
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

// Member 2 routes
app.use('/api/auth',          authRoutes);
app.use('/api/trips',         tripRoutes);
app.use('/api/expenses',      expenseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/weather',       weatherRoutes);

// Member 3 routes
app.use('/api/itinerary',     itineraryRoutes);
app.use('/api/chatbot',       chatbotRoutes);
app.use('/api/translate',     translatorRoutes);
app.use('/api/maps',          mapsRoutes);

app.get('/health', (_req, res) =>
  res.json({ status: 'OK', uptime: process.uptime() })
);
app.use(errorHandler);

module.exports = app;