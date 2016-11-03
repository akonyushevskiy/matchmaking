import { getMatches, deleteMatch } from './../controllers/matches';

module.exports = function (app) {
	app.get('/matches', getMatches);
	app.delete('/matches', deleteMatch);
};