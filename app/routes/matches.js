var matches = require('../controllers/matches');

module.exports = function (app) {
	app.get('/matches', matches);
};