import './PlayerDragPreview.scss';

import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

@DragLayer(monitor => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	clientOffset: monitor.getClientOffset(),
	isDragging: monitor.isDragging()
}))

export default class Preview extends Component {
	static propTypes = {
		item: PropTypes.object,
		itemType: PropTypes.string,
		clientOffset: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired
		}),
		isDragging: PropTypes.bool.isRequired
	};

	getPreviewStyles() {
		const { clientOffset } = this.props;

		return {
			transform: clientOffset ? `translate(${ clientOffset.x }px, ${ clientOffset.y }px)` : ''
		};
	}

	render() {
		const { item, itemType, isDragging } = this.props;

		if (!isDragging) { return null; }

		return (
			<div className={ `player-preview ${ item.team_name }` } style={ this.getPreviewStyles() }>
				<span className="circle">{ item.player.number }</span>
			</div>
		);
	}
}