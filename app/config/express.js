process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	jwt = require('jsonwebtoken'),
	ejwt = require('express-jwt'),
	passport = require('passport'),
	config = require('./config');

module.exports = function () {
	var app = express();

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(morgan('dev')); // TODO: Remove from production
		app.use(compress());
	}

	app.set('view engine', 'ejs');

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(methodOverride());

	app.use(passport.initialize());
	app
		.use(ejwt({
			secret: config.JWT,
			credentialsRequired: false
		})
		.unless({path: ['/login', '/registration']}));

	app.use(function (req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
		next();
	});

	app.use(function (err, req, res, next) {
		if (err.name === 'UnauthorizedError') {
			res.status(500).json({ status: 'error', code: 'unauthorized' });
		}
	});

	require('../routes/login')(app);
	require('../routes/registration')(app);
	require('../routes/matches')(app);
	require('../routes/add-match')(app);
	require('../routes/teams')(app);
	require('../routes/match')(app);
	require('../routes/pdf')(app);

	return app;
};
