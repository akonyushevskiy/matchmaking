var { getPositions } = require('../controllers/positions');

module.exports = function (app) {
	app.get('/positions', getPositions);
};