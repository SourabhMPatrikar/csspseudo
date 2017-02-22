var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
// Connection url
var url = 'mongodb://localhost:27017/dbCsspseudo';

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Connect using MongoClient
app.use(function(req,res,next){
	MongoClient.connect(url,function(err,db){
		if(err){
			console.log(err);
		}
		req.db = db;
		next();
	});
});

app.use('/', routes);
app.use('/users', users);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
//error handler
app.use(function(err, req, res, next) {
	//Development error handler
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {
	    message: err.message,
	    error: err
	};
	//production error handler
	// render the error page
	res.status(err.status || 500);
	res.render('error',{
	  message:err.message,
	  error:{}
	});
});

//development error handler
//will print stacktrace
//if (app.get('env') === 'development') {
//app.use(function(err, req, res, next) {
// res.status(err.status || 500);
// res.render('error', {
//   message: err.message,
//   error: err
// });
//});
//}
//
////production error handler
////no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//res.status(err.status || 500);
//res.render('error', {
// message: err.message,
// error: {}
//});
//});

module.exports = app;
