const express = require('express');
const authRoutes = require("./routes/authRoutes");
const routineRoutes = require("./routes/routineRoutes");
const productRoutes = require("./routes/productRoutes");
const testRoutes = require("./routes/testRoutes");
const profileRoutes = require("./routes/profileRoutes");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const errorHandler = require('./middlewares/errorHandler');
const skinRoutes = require('./routes/skinRoutes');
const { listenForMessages } = require('./services/pubsubSubscriber');
require('dotenv').config();
listenForMessages();

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/skin', skinRoutes);
app.use('/profile', profileRoutes);
app.use('/routine', routineRoutes);
app.use('/product', productRoutes);
app.use('/test', testRoutes);

app.use(errorHandler);


module.exports = app;