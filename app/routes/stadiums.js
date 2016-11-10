var { getStadiums } = require('../controllers/stadiums');

module.exports = function (app) {
	app.get('/stadiums', getStadiums);
};