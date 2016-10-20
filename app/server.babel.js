process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	passport = require('./config/passport'),
	express = require('./config/express'),
	config = require('./config/config');

var db = mongoose();
var password = passport();
var app = express();
app.listen(config.PORT);
module.exports = app;

console.log('Server running at http://localhost:/' + config.PORT);