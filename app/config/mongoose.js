var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function () {
	var db = mongoose.connect(config.DB);

	db.Promise = global.Promise;
	require('../models/user');
	require('../models/teams');
	require('../models/matches');

	return db;
};