import fs from 'fs';
import ejs from 'ejs';
import pdf from 'html-pdf';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';

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
		ejs.renderFile(path.resolve(`${__dirname}/../views/pdf.ejs`), match, {}, function(err, str){
			pdf.create(str, {
				"height": "1131px",
				"width": "842px",
				"border": "20px"
			}).toFile(path.resolve(`${__dirname}/../../files/match.pdf`), function(err, data) {
				if (err) return console.log(err);

				res.download(data.filename);

				/*var file = fs.createReadStream(data.filename);
				var stat = fs.statSync(data.filename);
				res.setHeader('Content-Length', stat.size);
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader('Content-Disposition', 'attachment; filename=match.pdf');
				file.pipe(res);*/
				console.log(res);
			});
		});
	});

};
