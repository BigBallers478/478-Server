'use strict';

const express = require('express');
const app = express(); //creates express application
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./api/config/main');
const bodyParser = require('body-parser');
const events = require('./events');
const router = require('./api/routes/todoListRoutes');
const socketEvents = require('./socketEvents');
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
//Configuration
//*****************************************************************

//connects to the database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useMongoClient: true });

let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(port, host);
  console.log(`Your server is running at https:// ${config.port}`);
}
else {
  server = app.listen(port, host);
  console.log(`Your server is running at https:// ${config.port}`);
}

const io = require('socket.io').listen(server);

socketEvents(io);

//Middleware
//****************************************************************
app.use(bodyParser.urlencoded({ extended: false })); //gets info from POST and URL parameters
app.use(bodyParser.json()); //sends json responses
app.use(morgan('dev')); //log requests to the console

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router(app);

module.exports = server;

