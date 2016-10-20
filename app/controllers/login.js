var passport = require('passport'),
	jwt = require('jsonwebtoken'),
	config = require('../config/config');

module.exports = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) return next(err);

		if (!user) {
			return res.status(401).json({
				status: 'error',
				code: 'unauthorized'
			});
		} else {
			return res.json({
				token: jwt.sign({userId: user.id}, config.JWT),
				user: {
					id: user._id,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				}
			});
		}
	})(req, res, next);
};