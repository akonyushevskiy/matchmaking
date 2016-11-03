import React, { Component, PropTypes } from 'react';
import DragLayer from 'react-dnd/lib/DragLayer';

function collect (monitor) {
	return {
		clientOffset: monitor.getClientOffset()
	};
}

class DragPreview extends Component {

	getLayerStyles() {
		const { clientOffset } = this.props;
		return {
			position: 'fixed',
			left: 0,
			top: 0,
			zIndex: 100,
			transform: clientOffset ? `translate(${clientOffset.x}px, ${clientOffset.y}px)` : ''
		};
	}

	render () {
		const { isDragging, player, team } = this.props;
		if (!isDragging) { return null; }

		return (
			<div className={ `player-preview ${team}` } style={this.getLayerStyles()}>
				<span className="circle">{ player.number }</span>
			</div>
		);
	}
}

DragPreview.propTypes = {
	isDragging: PropTypes.bool,
	sourceOffset: PropTypes.shape({
		x: PropTypes.number.isRequired,
		y: PropTypes.number.isRequired
	})
};

export default DragLayer(collect)(DragPreview);