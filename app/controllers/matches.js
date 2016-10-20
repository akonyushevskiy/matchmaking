var	Matches = require('mongoose').model('Matches');

module.exports = function (req, res) {
	Promise
		.all([
			Matches.getMatches()
		])
		.then(([matches]) => {
			res.json({ matches })
		})
		.catch(error => { console.log(error) });
};