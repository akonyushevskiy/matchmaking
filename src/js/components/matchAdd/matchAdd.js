import './MatchAdd.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Icon from '../Icon.js';
import MatchEdit from '../MatchEdit/MatchEdit';

import { fetchAddMatch } from '../../actions/index';

class MatchAdd extends Component {
	static contextTypes = {
		router: PropTypes.object
	};

	constructor () {
		super();
		this.state = { edit: false, loading: false }
	}

	onSubmit (match) {

		this.setState({ loading: true });

		this.props.fetchAddMatch({
			date: moment(`${match.date} ${match.start}`, "DD.MM.YYYY HH:mm").format(),
			location: match.location,
			home_team: match.home_team,
			quest_team: match.quest_team
		}).then((data) => {
			this.setState({ loading: false });
			this.context.router.push(`/match/${data.payload.data.match._id}`);
		});
	}

	toogleActive () {
		this.setState({ edit: !this.state.edit });
	}

	render () {
		const matchAddRender = () => {
			if (this.state.edit) {
				return (
					<MatchEdit
						onSubmit={ this.onSubmit.bind(this) }
						onCancel={ this.toogleActive.bind(this) }
						title="Add new match"
						btn="Save"
						loading={ this.state.loading }
					/>
				);
			} else {
				return (
					<a className="btn-add" onClick={ this.toogleActive.bind(this) }>
						<Icon name="add" />
						Add new match
					</a>
				);
			}
		};

		return (
			<div className="match-add">
				{ matchAddRender() }
			</div>
		);
	}
}

export default connect(null, { fetchAddMatch })(MatchAdd);