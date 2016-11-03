var	Matches = require('mongoose').model('Matches');

export function getMatches(req, res) {
	Promise
		.all([
			Matches.getMatches()
		])
		.then(([matches]) => {
			res.json({ matches })
		})
		.catch(error => { console.log(error) });
}

export function deleteMatch(req, res) {
	Matches.findOne({ _id: req.query.id}).remove(function (...params) {
		getMatches(req, res);
	});
}