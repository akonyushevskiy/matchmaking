import './Player.scss';

import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import Icon from '../Icon.js';

const Types = {
	PLAYER: 'player'
};

const Source = {
	beginDrag(props) {
		return {
			player: props.player,
			team_name: props.team_name,
			match: props.match
		};
	},
	canDrag: function(props, monitor) {
		return !(props.player.active || props.player.reserve);
	}
};

@DragSource(Types.PLAYER, Source, (connect, monitor) => ({
	connectDragPreview: connect.dragPreview(),
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	canDrag: monitor.canDrag()
}))

export default class Player extends Component {
	static propTypes = {
		connectDragPreview: PropTypes.func.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		player: PropTypes.object.isRequired,
		team_name: PropTypes.string.isRequired,
		match: PropTypes.object.isRequired
	};

	render() {
		const { connectDragSource, player } = this.props;

		return connectDragSource(
			<div className={ `player ${ (player.active || player.reserve) ? 'no-dragable' : ''}`}>
				<div className="player-info-left">
					<div className="player-number">{ player.number }</div>
					<div className="player-image">
						<Icon name="player" />
					</div>
				</div>
				<div className="player-name">{ player.name }</div>
				<div className="player-role">{ player.position }</div>
			</div>
		);
	}
}