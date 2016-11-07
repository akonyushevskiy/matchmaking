import './MatchListItem.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { connect } from 'react-redux';

import Icon from '../Icon.js';
import MatchEdit from '../MatchEdit/MatchEdit';

import { updateMatch, deleteMatch } from '../../actions/index';

class MatchListItem extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor () {
		super();
		this.state = { edit: false, loading: false }
	}

	onSubmit (match) {
		const { date, home_team, location, quest_team, start } = match;
		var saveData = {
			match_id: this.props.match._id,
			date: moment(`${match.date} ${match.start}`, "DD.MM.YYYY HH:mm").format(),
			location
		};

		if (home_team != this.props.match.home_team.team_id) {
			saveData.home_team = home_team;
		}

		if (quest_team != this.props.match.quest_team.team_id) {
			saveData.quest_team = quest_team;
		}

		this.setState({ loading: true });
		this.props.updateMatch({ ...saveData }).then((data) => {
			this.setState({ edit: !this.state.edit, loading: false });
			this.context.router.push(`/match/${data.payload.data.match._id}`);
		});
	}

	toogleActive () {
		this.setState({ edit: !this.state.edit });
	}

	deleteHandler () {
		const { match, deleteMatch } = this.props;
		this.setState({ loading: true });
		deleteMatch({ id: match._id });
	}

	render () {
		const { match } = this.props;

		const matchItemRender = () => {
			if (this.state.edit) {
				return (
					<MatchEdit
						onSubmit={ this.onSubmit.bind(this) }
						onCancel={ this.toogleActive.bind(this) }
						title="Edit match"
						btn="Save"
						match={{ ...match }}
						loading={ this.state.loading }
						onDelete={ this.deleteHandler.bind(this) }
					/>
				);
			} else {
				return (
					<div className="info">
						<Link to={ `/match/${match._id}` } className="link">
							<span className="logos">
								<img src={ `./images/${ match.home_team.team_id }.jpg` } alt=""/>
								<img src={ `./images/${ match.quest_team.team_id }.jpg` } alt=""/>
							</span>
							<span className="name">
								{ `${ match.home_team.team_name } – ${ match.quest_team.team_name }` }
							</span>
							<span className="desc">
								{ `${ match.home_team.stadion_name }, ${ match.location } | ${ moment(match.date).format('DD.MM.YYYY HH:mm') }` }
							</span>
						</Link>
						<div className="controls">
							<a className="control" onClick={ this.toogleActive.bind(this) }><Icon name="pencil" /></a>
							<Link className="control" to={ `/export/${match._id}` }><Icon name="pdf" /></Link>
						</div>
					</div>
				);
			}
		};

		return (
			<div className="match-list-item">
				{ matchItemRender() }
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { matches: state.matches };
}

export default connect(mapStateToProps, { updateMatch, deleteMatch })(MatchListItem);