const express = require('express');
const authRoutes = require("./routes/authRoutes");
const routineRoutes = require("./routes/routineRoutes");
const productRoutes = require("./routes/productRoutes");
const testRoutes = require("./routes/testRoutes");
const bestRoutes = require("./routes/bestRoutes");
const profileRoutes = require("./routes/profileRoutes");
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const { listenForMessages } = require('./services/pubsubSubscriber');
listenForMessages();

const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/routine', routineRoutes);
app.use('/product', productRoutes);
app.use('/test', testRoutes);
app.use('/best', bestRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);


module.exports = app;