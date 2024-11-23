const express = require('express');
const authRoutes = require("./routes/authRoutes");
const routineRoutes = require("./routes/routineRoutes")
const prouctRoutes = require("./routes/productRoutes")
const testRoutes = require("./routes/testRoutes")
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/', routineRoutes);
app.use('/', prouctRoutes);
app.use('/', testRoutes);


app.use(errorHandler);

module.exports = app;