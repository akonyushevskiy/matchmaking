import './MatchList.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MatchAdd from '../MatchAdd/matchAdd.js';
import MatchListItem from '../matchListItem/matchListItem.js';

import { fetchMatches } from '../../actions/index';

class MatchList extends Component {

	renderMatches() {
		const { matches } = this.props;

		if ( matches.length ) {
			return this.props.matches.map((match, key) => {
				return <MatchListItem key={ key } match={ match }/>
			});
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
	return { matches: state.matches };
}

export default connect(mapStateToProps, { fetchMatches })(MatchList);