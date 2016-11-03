var pdf = require('../controllers/pdf');

module.exports = function (app) {
	app.get('/pdf', pdf.render);
};