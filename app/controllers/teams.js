var	Matches = require('mongoose').model('Matches'),
	Teams = require('mongoose').model('Teams');

module.exports = function (req, res) {
	Promise
		.all([
			Teams.getTeams()
		])
		.then(([teams]) => {
			res.json({ teams })
		})
		.catch(error => { console.log(error) });
};