var registration = require('../controllers/registration');

module.exports = function (app) {
	app.post('/registration', registration);
};