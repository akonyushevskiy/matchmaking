import fs from 'fs';
import ejs from 'ejs';
import pdf from 'html-pdf';
import _ from 'lodash';
import moment from 'moment';

var	Matches = require('mongoose').model('Matches');

exports.render = function (req, res) {
	Matches.findOne({
		_id: req.query.id
	}, (err, match) => {

		match.home_team.groups = _.chunk(match.home_team.items, 3);
		match.quest_team.groups = _.chunk(match.quest_team.items, 3);
		match.comment = req.query.comment;
		match.times = {
			date: moment(match.date).format('DD.MM.YYYY'),
			time: moment(match.date).format('HH:mm')
		};

		/*res.render(`${__dirname}/../views/pdf.ejs`, match);*/
		ejs.renderFile(`${__dirname}/../views/pdf.ejs`, match, {}, function(err, str){
			pdf.create(str, {
				"height": "1131px",
				"width": "842px",
				"border": "20px"
			}).toFile(`${__dirname}/../../files/match.pdf`, function(err, data) {
				if (err) return console.log(err);
				res.download(data.filename);
				console.log(res);
			});
		});
	});

};