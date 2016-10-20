var addMatch = require('../controllers/add-match');

module.exports = function (app) {
	app.post('/add_match', addMatch);
};