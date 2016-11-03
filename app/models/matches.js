import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MatchesScheme = new Schema({
	date: Date,
	location: String,
	home_team: Object,
	quest_team: Object
});

MatchesScheme.statics.getMatches = function() {
	return this.aggregate([
		{
			$project: {
				date: "$date",
				location: "$location",
				home_team: {
					team_name: "$home_team.team_name",
					team_id: "$home_team.team_id",
					stadion_name: "$home_team.stadion_name"
				},
				quest_team: {
					team_name: "$quest_team.team_name",
					team_id: "$quest_team.team_id",
					stadion_name: "$quest_team.stadion_name"
				}
			}
		}
	]).then(matches => {
		return matches;
	}).catch((error) => {
		throw new Error(error.message);
	});
};

mongoose.model('Matches', MatchesScheme);