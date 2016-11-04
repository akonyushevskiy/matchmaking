var pdf = require('../controllers/pdf');

module.exports = function (app) {
	app.get('/export', pdf.render);
};
