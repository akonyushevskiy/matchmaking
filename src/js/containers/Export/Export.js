import './Export.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';

import { fetchMatch, ROOT_URL } from '../../actions/index';
import Icon from '../../components/Icon.js';

function mapStateToProps(state) {
	return { match: state.match };
}

@connect(mapStateToProps, { fetchMatch })

export default class Export extends Component {
	constructor() {
		super();

		this.state = { comment: '' }
	}

	componentDidMount() {
		this.props.fetchMatch({
			id: this.props.params.match_id
		});
	}

	renderPlayers(team_name) {
		return this.props.match[team_name].items.map((player, key) => {
			return (
				<tr key={ key }>
					<td className="text-right">{ player.number }</td>
					<td>{ player.name }</td>
					<td>{ player.position }</td>
				</tr>
			);
		});
	}

	renderPitchPlayers(team_name) {
		return this.props.match[team_name].items.map((player, key) => {
			if (!player.active) { return null; }

			return (
				<div key={ key } className={ `pitch-player ${team_name}`} style={{ left: `${player.offset.left * 100}%`, top: `${player.offset.top * 100}%` }}>
					{ player.number }
					<div className="pitch-player-name">{ player.name.split(/\s+/).slice(1, 2) }</div>
				</div>
			);
		});
	}

	renderProfiles(team_name) {
		const renderValues = (values) => {
			var copy = _.cloneDeep(values);
			copy.splice(3, 1);

			const ReplaceValue = (value) => {
				switch (value) {
					case 0: return '––';
					case 1: return '–';
					case 2: return '0';
					case 3: return '+';
					case 4: return '++';
					default: return '-';
				}
			};

			return copy.map((value, key) => {
				return (
					<td key={ key }>{ ReplaceValue(value.value) }</td>
				)
			});
		};

		const renderGroup = (group) => {
			return group.map((player, key) => {
				return (
					<div className="player-profile" key={ key }>
						<h2>{ player.name }</h2>
						<hr/>
						<div className="mt">
							<div><b>Number:</b> { player.number }</div>
							<div><b>Position:</b> { player.position }</div>
						</div>
						<div className="mt">
							<div><b>Comment:</b></div>
							<div>{ player.values[3].value ? decodeURIComponent(player.values[3].value).split('\n').map((item, key) => <span key={ key }>{item}<br/></span>) : '' }</div>
						</div>
						<table>
							<thead>
							<tr>
								<th width="20%">Goal</th>
								<th width="20%">Pass</th>
								<th width="20%">Tackle</th>
								<th width="20%">Technique</th>
								<th width="20%">Speed</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								{ renderValues(player.values) }
							</tr>
							</tbody>
						</table>
					</div>
				);
			});
		};

		return _.chunk(this.props.match[team_name].items, 3).map((group, key) => {
			return (
				<div key={ key } className="export-page">
					{ key === 0 ? <h2>{ this.props.match[team_name].team_name } Profiles</h2> : null }
					{ renderGroup(group) }
				</div>
			);
		});
	}

	onCommentChange(comment) {
		this.setState({ comment });
	}

	render() {
		const { match } = this.props;

		if (!match) return <div>Loading...</div>;

		return (
			<div className="export">
				<div className="export-header">
					<Link className="back" to="/">
						<Icon name="arrow"></Icon>
					</Link>
					<div className="logos">
						<img src={ `../images/${ match.home_team.team_id }.jpg` } alt=""/>
						<img src={ `../images/${ match.quest_team.team_id }.jpg` } alt=""/>
					</div>
					<div className="name">
						{ `${ match.home_team.team_name } – ${ match.quest_team.team_name }` }
					</div>
					<div className="desc">
						{ `${ match.match.location.label } | ${ moment(match.match.date).format('DD.MM.YYYY HH:mm') }` }
					</div>
					<a href={ `${ROOT_URL}/export?id=${this.props.params.match_id}&comment=${this.state.comment.replace(/\r?\n/g, '<br/>')}`} className="btn btn-green">Export</a>
				</div>

				<div className="export-page">
					<div className="export-title"></div>
					<h2 className="text-center">
						{ `${ match.home_team.team_name } – ${ match.quest_team.team_name }` }
					</h2>

					<div className="mt">
						<div>
							<b>Date:</b> { moment(match.match.date).format('DD.MM.YYYY') }
						</div>
						<div>
							<b>Time:</b> { moment(match.match.date).format('HH:mm') }
						</div>
						<div>
							<b>Location:</b> { match.match.location.label }
						</div>
					</div>

					<div className="export-comment-title"><b>Comment</b></div>
					<textarea className="export-comment" onChange={ (event) => { this.onCommentChange(event.target.value) }} value={ this.state.comment } placeholder="Add your comment"></textarea>

					{
						(match.home_team.note || match.quest_team.note) ?
							<table>
								<caption>Teams comment</caption>
								<thead>
								<tr>
									<th>{ match.home_team.team_name }</th>
									<th>{ match.quest_team.team_name }</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>{ decodeURIComponent(match.home_team.note).split('\n').map((item, key) => <span key={ key }>{item}<br/></span>) }</td>
									<td>{ decodeURIComponent(match.quest_team.note).split('\n').map((item, key) => <span key={ key }>{item}<br/></span>) }</td>
								</tr>
								</tbody>
							</table>
							: null
					}
				</div>

				<div className="export-page">
					<div className="export-pitch">
						<svg className="pitch-svg">
							<g className="pitch-area">
								<defs>
									<clipPath id="cut">
										<rect x="1" y="160.03999999999994" width="662" height="675.9199999999996" fill="red"></rect>
									</clipPath>
								</defs>
								<rect x="1" y="1" width="662" height="993.9999999999995"></rect>
								<rect x="133.4" y="1" width="397.2" height="159.03999999999994"></rect>
								<rect x="133.4" y="835.9599999999996" width="397.2" height="159.03999999999994"></rect>
								<rect x="232.7" y="1" width="198.6" height="59.63999999999997"></rect>
								<rect x="232.7" y="935.3599999999996" width="198.6" height="59.63999999999997"></rect>
								<line x1="1" x2="663" y1="497.9999999999998" y2="497.9999999999998"></line>
								<circle cx="332" cy="497.9999999999998" r="92.68"></circle>
								<circle cx="332" cy="110.33999999999995" r="92.68" clipPath="url(#cut)"></circle>
								<circle cx="332" cy="885.6599999999996" r="92.68" clipPath="url(#cut)"></circle>
							</g>
						</svg>
						{ this.renderPitchPlayers('home_team') }
						{ this.renderPitchPlayers('quest_team') }
					</div>
				</div>

				<div className="export-page">
					<h3 className="mt">{ match.home_team.team_name } players</h3>
					<table>
						<thead>
						<tr>
							<th width="50" className="text-right">№</th>
							<th width="70%">Name</th>
							<th width="30%">Position</th>
						</tr>
						</thead>
						<tbody>
						{ this.renderPlayers('home_team') }
						</tbody>
					</table>
				</div>

				<div className="export-page">
					<h3 className="mt">{ match.quest_team.team_name } players</h3>
					<table>
						<thead>
						<tr>
							<th width="50" className="text-right">№</th>
							<th width="70%">Name</th>
							<th width="30%">Position</th>
						</tr>
						</thead>
						<tbody>
						{ this.renderPlayers('quest_team') }
						</tbody>
					</table>
				</div>

				{ this.renderProfiles('home_team') }
				{ this.renderProfiles('quest_team') }

			</div>
		);
	}
}