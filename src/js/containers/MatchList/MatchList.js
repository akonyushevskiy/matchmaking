import './MatchList.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MatchAdd from '../../components/MatchAdd/MatchAdd.js';
import MatchListItem from '../../components/MatchListItem/MatchListItem.js';

import { fetchMatches } from '../../actions/index';

class MatchList extends Component {

	renderMatches() {
		const { matches } = this.props;

		if ( matches.length ) {
			return this.props.matches.map(match => <MatchListItem key={ match._id } match={ match }/>);
		}
	}

	componentWillMount() {
		this.props.fetchMatches();
	}

	render () {
		return (
			<div className="match-list">
				<div className="vertical-align">
					<div className="container">
						<h1>Scoutpad</h1>
						<div className="list">
							<MatchAdd />
							{ this.renderMatches() }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {

	console.log(state);

	return { matches: state.matches };
}

export default connect(mapStateToProps, { fetchMatches })(MatchList);