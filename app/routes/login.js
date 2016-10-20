var login = require("../controllers/login");

module.exports = function (app) {

	app.post('/login', login);
};