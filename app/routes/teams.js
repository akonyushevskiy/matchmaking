var teams = require('../controllers/teams');

module.exports = function (app) {
	app.get('/teams', teams);
};