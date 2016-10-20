import { getMatch, updateMatch } from '../controllers/match';

module.exports = function (app) {
	app.get('/match', getMatch);
	app.post('/match', updateMatch);
};