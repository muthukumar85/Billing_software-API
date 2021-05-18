var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var url = 'mongodb://localhost:27017/Billing';
const connect = mongoose.connect(url);
var authenticate = require('./authenticate');
var config = require('./config');

connect.then((db)=>{
  console.log("connected properly to the server");
}, (err)=>{
  console.log(err);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productrouter = require('./routes/productsrouter');
const categoryrouter = require('./routes/categoryrouter');
const soldoutrouter = require('./routes/soldoutrouter');
const overallstockrouter = require('./routes/overallstockrouter');
const CashierRouter = require('./routes/cashierRouter');
const CashiersRouter = require('./routes/counterRouter');
const billrouter = require('./routes/billRouter');
const UpstockRouter = require('./routes/upstockrouter');
const PaidRouter = require('./routes/paidrouter');

var app = express();
app.all('*' , (req, res, next)=>{
  if(req.secure){
    return next();
  }
  else{
    res.redirect(307 , 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/' , productrouter);
app.use('/' , categoryrouter);
app.use('/' , soldoutrouter);
app.use('/' , overallstockrouter);
app.use('/' , CashierRouter);
app.use('/' , CashiersRouter);
app.use('/' , billrouter);
app.use('/' , UpstockRouter);
app.use('/' , PaidRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
