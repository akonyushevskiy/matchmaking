var User = require('mongoose').model('User'),
	login = require('./login');

module.exports = function (req, res, next) {

	console.log(req.user);

	if (!req.user) {
		var user = new User(req.body);
		 user.provider = 'local';
		 user.save(function(err) {
			 if (err) {
				 if (err.code === 11000){
					 return res.json({
						 error: true,
						 message: 'A person with this name already exists'
					 });
				 } else {
					 return res.json({
						 error: true,
						 message: 'Failed to register'
					 })
				 }
			 }
			 login(req, res, next);
		 });
	}
};