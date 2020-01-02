const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sensorsRoutes = require('./api/routes/sensors');
const devicesRoutes = require('./api/routes/devices');
const calibrationsRoutes = require('./api/routes/calibrations');
const equipmentsRoutes = require('./api/routes/equipments');
const organisationsRoutes = require('./api/routes/organisations');
const usersRoutes = require('./api/routes/users');
const authRoutes = require('./api/routes/auth');
const deviceTypesRoutes = require('./api/routes/deviceTypes');

//Auth middleware
const isAuth = require('./api/middleware/is-auth');

//Database connection
mongoose.connect(`mongodb://127.0.0.1:27017/pgp-api`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Middlewares
app.use(morgan('common'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ADD CORS HEADERS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST,GET,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

//Authorisation Middleware
app.use(isAuth);

//Routes
app.use('/auth', authRoutes);
app.use('/sensors', sensorsRoutes);
app.use('/devices', devicesRoutes);
app.use('/calibrations', calibrationsRoutes);
app.use('/equipments', equipmentsRoutes);
app.use('/organisations', organisationsRoutes);
app.use('/users', usersRoutes);
app.use('/deviceTypes', deviceTypesRoutes);

//handle error
app.use((req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
