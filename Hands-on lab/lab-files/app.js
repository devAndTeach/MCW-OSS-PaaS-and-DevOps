var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var order = require('./routes/order');
var plan = require('./routes/plan');
var user = require('./routes/user');
var userSession = require('./routes/session');

var app = express();

//var databaseUrl = 'mongodb://localhost:27017/best-for-you-organics';
//var databaseUrl ='mongodb://cosmos-best-for-you-db-eastus-001:OKbkboy31mmt7W4uWf9l4Rmq9tk9Z6CFUCztCKZ62NaQdUdKaCCymduelDH36DDZ1uxsorfo3Qc6mINv2CdsVQ==@cosmos-best-for-you-db-eastus-001.mongo.cosmos.azure.com:10255/best-for-you-organics?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-best-for-you-db-eastus-001@'

var databaseUrl ='mongodb://cosmos-best-for-you-db-eastus-001:DwySTt7k5LW7bNuPVJ6los5HWDEzJRPVTslY1hoRKjzMDvGPaCyU3e5f6E7Uyx2Yy3uk9Xhy55qAuMAE1LqDLA==@cosmos-best-for-you-db-eastus-001.mongo.cosmos.azure.com:10255/best-for-you-organics?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-best-for-you-db-eastus-001@'

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(databaseUrl, { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
var db = mongoose.connection;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(express.static(path.join(__dirname, 'build')));
app.use(session(
  {
    secret: 'best-for-you-organics',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: db })
  }
));

app.use('/api/order', order);
app.use('/api/plan', plan);
app.use('/api/user', user);
app.use('/api/session', userSession);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;