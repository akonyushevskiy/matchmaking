import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const Types = {
	PLAYER: 'player'
};

const Source = {
	beginDrag(props, monitor, component) {
		return {
			player: props.player,
			team_name: props.team_name,
			match: props.match
		};
	},
	endDrag(props, monitor, component) {
		/*if (!monitor.didDrop()) {
			props.removePlayerFromPitch(props.player, props.team_name)
		}*/
	},
	canDrag: function (props, monitor) {
		return !props.controlActive;
	}
};

@DragSource(Types.PLAYER, Source, (connect, monitor) => ({
	connectDragPreview: connect.dragPreview(),
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	canDrag: monitor.canDrag()
}))

export default class PitchPlayer extends Component {
	static propTypes = {
		connectDragPreview: PropTypes.func.isRequired,
		connectDragSource: PropTypes.func.isRequired,
		player: PropTypes.object.isRequired,
		team_name: PropTypes.string.isRequired
	};

	renderControl() {
		if (this.props.controlActive) {
			return (
				<svg>
					<g transform={'translate(175, 175)'}>
						{ this.props.children }
					</g>
				</svg>
			);
		}
	};

	openControl(event) {
		event.stopPropagation();
		this.props.openControl();
	}

	render() {
		const { connectDragSource, isDragging, player, team_name, className } = this.props;

		if (isDragging) { return null; }

		const position = {
			left: `${ this.props.player.offset.left * 100 }%`,
			top: `${ this.props.player.offset.top * 100 }%`
		};

		return connectDragSource(
			<div className={ `pitch-player ${ team_name } ${ className }`} style={ position } >
				<span className="number" onClick={ this.openControl.bind(this) }>{ player.number }</span>
				<div className="pitch-player-name">{ player.name.split(/\s+/).slice(1, 2) }</div>
				{ this.renderControl() }
			</div>
		)
	}
}