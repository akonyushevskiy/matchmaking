import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Icon from '../Icon.js';

export default class PlayerNote extends Component {
	static propTypes = {
		team: PropTypes.string.isRequired
	};

	constructor() {
		super();

		this.state = {
			oldValue: '',
			newValue: null
		}
	}

	componentWillMount() {
		const { player } = this.props;
		for (var i = 0, l = player.values.length; i < l; i++) {
			if (player.values[i].name === 'comment' && decodeURIComponent(player.values[i].value)) {
				this.setState({ oldValue: player.values[i].value ? decodeURIComponent(player.values[i].value) : '' })
			}
		}
	}

	componentDidUpdate() {
		console.log('componentDidUpdate');
		const { player } = this.props;
		for (var i = 0, l = player.values.length; i < l; i++) {
			if (player.values[i].name === 'comment' && player.values[i].value && decodeURIComponent(player.values[i].value) !== this.state.oldValue) {
				this.setState({
					oldValue: player.values[i].value ? decodeURIComponent(decodeURIComponent(player.values[i].value)) : '',
					newValue: null
				});
			}
		}
	}

	onChangeHandler(value) {
		this.setState({
			newValue: value || ''
		});
	}

	onBlurHandler() {
		this.props.save(this.state.newValue);
	}

	render() {
		const { player } = this.props;
		return (
			<div className="player-note">
				<div className="player-name">{ player.name }</div>
				<textarea
					className="note-textarea"
					value={ typeof this.state.newValue === 'string' ? this.state.newValue : this.state.oldValue }
					onChange={event => this.onChangeHandler(event.target.value)}
					onBlur={ this.onBlurHandler.bind(this) }
				/>
			</div>
		);
	}
}