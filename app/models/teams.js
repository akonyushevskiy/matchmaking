import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TeamsScheme = new Schema({
	items: Array,
	stadion_name: String,
	team_id: Number,
	active: Boolean,
	team_name: String,
	stadion_id: Number,
	note: String
});

TeamsScheme.statics.getTeams = function() {
	return this.aggregate([
		{
			'$project': {
				_id: 0,
				team_name: "$team_name",
				team_id: "$team_id"
			}
		}
	]).then(( teams ) => {
		return teams;
	}).catch((error) => {
		throw new Error(error.message);
	});
};

mongoose.model('Teams', TeamsScheme);