import './Reserve.scss';

import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

const Types = {
	PLAYER: 'player'
};

const Target = {
	drop(props, monitor, component) {
		const { player, team_name, match } = monitor.getItem();

		if (monitor.isOver()) {
			console.log('заменить');
			console.log({ player, team_name, match });
		}
	}
};

const Source = {
	beginDrag(props) {
		return {
			player: props.player,
			team_name: props.team_name,
			match: props.match
		};
	}
};

@DropTarget(Types.PLAYER, Target, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))

@DragSource(Types.PLAYER, Source, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))

export default class ReservePLayer extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		isOver: PropTypes.bool.isRequired
	};

	render() {
		const { connectDropTarget, connectDragSource, player, team_name } = this.props;

		return connectDragSource(connectDropTarget(
			<div className={`reserve-player ${team_name}`}>{ player.number }</div>
		));
	}
}