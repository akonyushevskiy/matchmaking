import './Player.scss';

import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import Icon from '../Icon.js';
import DragPreview from './Preview.js';

const Types = {
	PLAYER: 'player'
};

const Source = {
	beginDrag(props) {
		return {
			player: props.player,
			team: props.team
		};
	},
	canDrag: function(props, monitor) {
		return !props.player.active;
	}
};


class Player extends Component {
	static propTypes = {
		connectDragPreview: PropTypes.func.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		player: PropTypes.object.isRequired,
		team: PropTypes.string.isRequired
	};

	render() {
		const { connectDragSource, player } = this.props;

		return connectDragSource(
			<div className={ `player ${ player.active ? 'no-dragable' : ''}`}>
				<DragPreview {...this.props} />
				<div className="player-info-left">
					<div className="player-number">{ player.number }</div>
					<div className="player-image">
						<Icon name="player" />
					</div>
				</div>
				<div className="player-name">{ player.name }</div>
				<div className="player-role">Keeper</div>
			</div>
		);
	}
}

export default DragSource(Types.PLAYER, Source, (connect, monitor) => ({
	connectDragPreview: connect.dragPreview(),
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	canDrag: monitor.canDrag()
}))(Player);