var	Matches = require('mongoose').model('Matches'),
	Teams = require('mongoose').model('Teams');

import _ from 'lodash';

export function getMatch(req, res) {
	Promise
		.all([
			Matches.findOne({
				_id: req.query.id
			})
		])
		.then(([match]) => {
			res.json({ match })
		})
		.catch(error => { console.log(error) });
}

export function updateMatch(req, res) {

	const addValues = (item, key) => {
		item.number = key + 1;
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

	const { match_id, ...update } = req.body;

	console.log(update);

	let promises = [];

	promises.push(
		Matches.findOneAndUpdate({
			_id: match_id
		}, {
			...update
		}, {
			new: true
		})
	);

	console.log(typeof update.home_team);
	console.log(typeof update.home_team);

	if (typeof update.home_team === 'number') {
		promises.push(
			Teams.findOne({
				team_id: update.home_team
			})
			.then((team) => {
				team.items = team.items.map(addValues);
				return Matches.findOneAndUpdate({
					_id: match_id
				}, {
					home_team: team
				}, {
					new: true
				})
			})
		)
	}

	if (typeof update.quest_team === 'number') {
		promises.push(
			Teams.findOne({
				team_id: update.quest_team
			})
			.then((team) => {
				team.items = team.items.map(addValues);
				return Matches.findOneAndUpdate({
					_id: match_id
				}, {
					quest_team: team
				}, {
					new: true
				})
			})
		)
	}

	Promise
		.all(promises)
		.then(([ ...updated ]) => {
			console.log(updated.length);
			res.json({ match: _.last(updated) })
		})
		.catch(error => { console.log(error) });
}