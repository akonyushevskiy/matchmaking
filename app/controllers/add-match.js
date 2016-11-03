var	Matches = require('mongoose').model('Matches'),
	Teams = require('mongoose').model('Teams');

module.exports = function (req, res) {

	const { home_team, quest_team, location, date } = req.body;

	const addValues = (item, key) => {
		item.number = key + 1;
		item.reserve = false;
		item.active = false;
		item.offset = {
			left: null,
			top: null
		};
		item.values = [{
			name: 'goal',
			active: false,
			value: null
		},{
			name: 'pass',
			active: false,
			value: null
		},{
			name: 'tackle',
			active: false,
			value: null
		},{
			name: 'comment',
			active: false,
			value: null
		},{
			name: 'technique',
			active: false,
			value: null
		},{
			name: 'speed',
			active: false,
			value: null
		}];

		return item;
	};

	Promise
		.all([
			Teams.findOne({ team_id: home_team }),
			Teams.findOne({ team_id: quest_team })
		])
		.then(([ home_team, quest_team ]) => {

			home_team.items.map(addValues);
			quest_team.items.map(addValues);

			const match = new Matches({
				location, date, home_team, quest_team
			});

			match.save((err, match) => {
				if (err) console.log(err);
				res.json({ match })
			});
		})
		.catch(error => { console.log(error) });
};