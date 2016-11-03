import './Reserve.scss';

import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import _ from 'lodash';

import ReservePLayer from './ReservePlayer.js';
import { updateMatchTeam } from '../../actions/index';

const Types = {
	PLAYER: 'player'
};

const Target = {
	drop(props, monitor, component) {

		const { player, team_name, match } = monitor.getItem();

		if (monitor.isOver() && !player.reserve) {
			var toSave = {};
				toSave['match_id'] = match.match._id;
				toSave[team_name] = _.cloneDeep(match[team_name]);
				toSave[team_name].items = toSave[team_name].items.map((item) => {
					if (item.number === player.number) {
						item.reserve = true;
					}
					return item;
				});

			props.updateMatchTeam({...toSave});
		}
	}
};

function mapStateToProps(state) {
	return { match: state.match };
}

@DropTarget(Types.PLAYER, Target, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))

@connect(mapStateToProps, { updateMatchTeam })

export default class Reserve extends Component {
	static propTypes = {
		connectDropTarget: PropTypes.func.isRequired,
		isOver: PropTypes.bool.isRequired
	};

	renderPlayers(team_name) {
		const players = this.props.match[team_name];

		return (
			players.items
				.filter(player => player.reserve)
				.map((player, key) => <ReservePLayer key={ key } team_name={ team_name } player={ player }  />)
		)
	}

	render() {
		const { connectDropTarget } = this.props;

		return connectDropTarget(
			<div className="reserve">
				{ this.renderPlayers('home_team') }
				{ this.renderPlayers('quest_team') }
			</div>
		)
	}
}