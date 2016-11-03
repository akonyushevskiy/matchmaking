require('babel-register');

var mongoose = require('../app/config/mongoose');

var db = mongoose();

var fs = require('fs'),
	Teams = require('mongoose').model('Teams'),
	Matches = require('mongoose').model('Matches');

fs.readFile(__dirname + '/players.json', 'utf8', function (err, players) {
	if (err) throw err;

	players = JSON.parse(players);

	Teams.create(players, function (err) {
		if (err) console.log(err);

		console.log('Done');
	});

	Matches.create([{
		date: 1476879510000,
		location: 'London',
		home_team: {
			"items": [
				{
					"position": "TW",
					"id": "20388",
					"name": "Manuel Neuer"
				},
				{
					"position": "RV",
					"id": "15207",
					"name": "Philipp Lahm"
				},
				{
					"position": "LV",
					"id": "50188",
					"name": "David Alaba"
				},
				{
					"position": "ZDM",
					"id": "3508",
					"name": "Xabi Alonso"
				},
				{
					"position": "RIV",
					"id": "37793",
					"name": "Javi Mart\u00ednez"
				},
				{
					"position": "LIV",
					"id": "38392",
					"name": "Mats Hummels"
				},
				{
					"position": "HRM",
					"id": "61558",
					"name": "Thiago Alc\u00e1ntara"
				},
				{
					"position": "HLM",
					"id": "42565",
					"name": "Arturo Vidal"
				},
				{
					"position": "ZST",
					"id": "56764",
					"name": "Robert Lewandowski"
				},
				{
					"position": "RA",
					"id": "55634",
					"name": "Thomas M\u00fcller"
				},
				{
					"position": "LA",
					"id": "28559",
					"name": "Franck Rib\u00e9ry"
				},
				{
					"position": "RV",
					"id": "21227",
					"name": "Rafinha"
				},
				{
					"position": "LV",
					"id": "105046",
					"name": "Juan Bernat"
				},
				{
					"position": "ZDM",
					"id": "165687",
					"name": "Joshua Kimmich"
				},
				{
					"position": "HLM",
					"id": "171319",
					"name": "Renato Sanches"
				},
				{
					"position": "LA",
					"id": "57195",
					"name": "Douglas Costa"
				},
				{
					"position": "RA",
					"id": "129508",
					"name": "Kingsley Coman"
				},
				{
					"position": "RA",
					"id": "40691",
					"name": "J\u00e9r\u00f4me Boateng"
				},
				{
					"position": "RA",
					"id": "8533",
					"name": "Arjen Robben"
				}
			].map(function (item, key) {
					item.reserve = false;
					item.active = false;
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
				}),
			"stadion_name": "Allianz Arena",
			"team_id": "156",
			"active": false,
			"team_name": "FC Bayern M\u00fcnchen",
			"stadion_id": "1"
		},
		quest_team: {
			"items": [
				{
					"position": "TW",
					"id": "45281",
					"name": "Roman B\u00fcrki"
				},
				{
					"position": "RV",
					"id": "204579",
					"name": "Felix Passlack"
				},
				{
					"position": "LV",
					"id": "52516",
					"name": "Marcel Schmelzer"
				},
				{
					"position": "LDM",
					"id": "49977",
					"name": "Sebastian Rode"
				},
				{
					"position": "RIV",
					"id": "39476",
					"name": "Sokratis"
				},
				{
					"position": "LIV",
					"id": "81138",
					"name": "Marc Bartra"
				},
				{
					"position": "RM",
					"id": "219438",
					"name": "Ousmane Demb\u00e9l\u00e9"
				},
				{
					"position": "RDM",
					"id": "19560",
					"name": "Gonzalo Castro"
				},
				{
					"position": "ZST",
					"id": "54694",
					"name": "Pierre-Emerick Aubameyang"
				},
				{
					"position": "ZOM",
					"id": "83090",
					"name": "Shinji Kagawa"
				},
				{
					"position": "LM",
					"id": "66842",
					"name": "Andre Sch\u00fcrrle"
				},
				{
					"position": "LDM",
					"id": "120772",
					"name": "Raphael Guerreiro"
				},
				{
					"position": "RV",
					"id": "42566",
					"name": "Lukasz Piszczek"
				},
				{
					"position": "RDM",
					"id": "179411",
					"name": "Julian Weigl"
				},
				{
					"position": "ZOM",
					"id": "69600",
					"name": "Mario G\u00f6tze"
				},
				{
					"position": "ZST",
					"id": "57254",
					"name": "Adri\u00e1n Ramos"
				},
				{
					"position": "LIV",
					"id": "111251",
					"name": "Matthias Ginter"
				},
				{
					"position": "RM",
					"id": "176413",
					"name": "Christian Pulisic"
				},
				{
					"position": "LM",
					"id": "220046",
					"name": "Emre Mor"
				},
				{
					"position": "LIV",
					"id": "195384",
					"name": "Mikel Merino"
				},
				{
					"position": "LV",
					"id": "100997",
					"name": "Joo-Ho Park"
				}
			].map(function (item, key) {
					item.reserve = false;
					item.active = false;
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
				}),
			"stadion_name": "Signal Iduna Park",
			"team_id": "157",
			"active": false,
			"team_name": "Borussia Dortmund",
			"stadion_id": "2"
		}
	}], (err) => {
		if (err) console.log(err);
		console.log('Done');
	})
});