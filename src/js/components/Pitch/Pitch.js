import './Pitch.scss';

import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import * as d3 from "d3";
import { connect } from 'react-redux';

import { updateMatchTeam } from '../../actions/index';

import Field from './PitchField.js';
import Player from './PitchPlayer.js';
import Controls from './PitchControls.js';
import PlayerDragPreview from './../Players/PlayerDragPreview.js';

const Types = {
	PLAYER: 'player'
};

const aspect = 0.666666666666667;
const margin = {
	top: 20,
	right: 20,
	bottom: 20,
	left: 20
};

const getPitchSize = () => {
	const width = window.innerWidth/2 - margin.left - margin.right;
	const height = window.innerHeight - margin.top - margin.bottom;

	if (width > height * aspect) {
		return {
			width: height * aspect,
			height: height
		};
	} else {
		return {
			width: width,
			height: width / aspect
		};
	}
};

const Target = {
	drop(props, monitor, component) {
		const { player, team_name } = monitor.getItem();
		const { width, height } = component.state;
		const PitchX = window.innerWidth / 2 - width - margin.right;
		const PitchY = (window.innerHeight - height) / 2;
		const { x, y } = monitor.getClientOffset();
		const [ left, top ] = [(x - window.innerWidth / 2 - PitchX) / width, (y - PitchY) / height];

		var toSave = { };
			toSave['match_id'] = props.params.match_id;
			toSave[team_name] = _.cloneDeep(props.match[team_name]);

		toSave[team_name].items = toSave[team_name].items.map((item) => {
			if (item.number === player.number) {
				if (left >=0 && left <= 1 && top >=0 && top <= 1) {
					item.active = true;
					item.offset = { left, top };
				} else {
					item.active = false;
					item.offset = { left: null, top: null };
				}
			}
			return item;
		});

		props.updateMatchTeam({...toSave});
	}
};

@DropTarget(Types.PLAYER, Target, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget()
}))

export default class Pitch extends Component {
	static propTypes = {
		connectDropTarget: PropTypes.func.isRequired
	};

	constructor() {
		super();

		const { width, height } = getPitchSize();
		const [ playerControls, activeInner, activeOuter, activeTeam, comment, commentActive ] = [ null, false, false, null, '', false ];
		this.state = { width, height, playerControls, activeInner, activeOuter, activeTeam, comment, commentActive };
		this.resizeHandler = this.resizeHandler.bind(this);
		this.hiderControls = this.hiderControls.bind(this);
	}

	resizeHandler() {
		const { width, height } = getPitchSize();
		this.setState({ width, height });
	}

	hiderControls () {
		const [ playerControls, activeInner, activeOuter, activeTeam, commentActive ] = [null, false, false, null, false];
		this.setState({ playerControls, activeInner, activeOuter, activeTeam, commentActive });
	}

	componentDidMount() {
		window.addEventListener('click', this.hiderControls);
		window.addEventListener('resize', this.resizeHandler);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.hiderControls);
		window.removeEventListener('resize', this.resizeHandler);
	}

	renderPlayers(team_name) {
		return this.props.match[team_name].items.map((player, key) => {
			if (!player.active) return null;

			const openControl = () => {
				if (this.state.playerControls && this.state.playerControls === key) {
					this.hiderControls();
				} else {
					this.setState({
						playerControls: key,
						activeInner: true,
						activeTeam: team_name,
						activeOuter: false,
						commentActive: false
					});
				}
			};

			const clickIn = (control) => {
				this.setState({
					activeOuter: control,
					commentActive: false
				});
			};

			const clickOut = (value) => {
				var toSave = {};
					toSave['match_id'] = this.props.params.match_id;
					toSave[team_name] = _.cloneDeep(this.props.match[team_name]);
					toSave[team_name].items[key].values[this.state.activeOuter].value = value;

				setTimeout(() => {
					this.setState({
						activeOuter: false
					});
				}, 1000);

				this.props.updateMatchTeam({...toSave});
			};

			const onAddComment = (comment) => {
				this.setState({
					commentActive: true,
					activeOuter: false,
					comment
				})
			};

			const controlActive = (key === this.state.playerControls && team_name === this.state.activeTeam);

			const renderControls = () => {
				if (!controlActive) { return null; }

				return (
					<Controls controls={ player.values } { ...this.state } onClickInner={ clickIn.bind(this) } onClickOuter={ clickOut.bind(this) } onAddComment={ onAddComment.bind(this) } />
				)
			};

			const removePlayerFromPitch = (player, team_name) => {
				var toSave = {};
					toSave['match_id'] = this.props.params.match_id;
					toSave[team_name] = _.cloneDeep(this.props.match[team_name]);
					toSave[team_name].items[key].active = false;
					toSave[team_name].items[key].offset = { left: null, top: null };

				this.props.updateMatchTeam({...toSave});
			};

			const toProps = { key, team_name, player };

			return (
				<Player className={ controlActive ? 'active' : '' } {...toProps} activeOuter={ this.state.activeOuter } controlActive={ controlActive } openControl={ openControl.bind(this) } removePlayerFromPitch={ removePlayerFromPitch.bind(this) }>
					{ renderControls() }
				</Player>
			);
		});
	}

	onCommentChange(comment) {
		this.setState({comment: comment});
	}

	saveComment() {
		const { match, params, updateMatchTeam } = this.props;
		const { activeTeam, playerControls, comment } = this.state;

		var toSave = {};
			toSave['match_id'] = params.match_id;
			toSave[activeTeam] = _.cloneDeep(match[activeTeam]);
			toSave[activeTeam].items[playerControls].values = toSave[activeTeam].items[playerControls].values.map((value, key) => {
				if (value.name === 'comment') {
					value.value = comment;
				}
				return value;
			});

		updateMatchTeam({...toSave});

		this.setState({
			commentActive: false
		});
	}

	renderComment () {
		return (
			<div className={ `pitch-comment ${this.state.commentActive ? 'active' : ''}` } onClick={ event => { event.stopPropagation() }}>
				<input className="input" type="text" placeholder="Type here..." value={ this.state.comment } onChange={event => this.onCommentChange(event.target.value)} />
				<button className="btn btn-green" onClick={ this.saveComment.bind(this) }>Save</button>
			</div>
		);
	}

	render () {
		const { connectDropTarget } = this.props;
		const { width, height } = this.state;
		const x = window.innerWidth / 2 - width - margin.right;
		const y = (window.innerHeight - height) / 2;

		return connectDropTarget(
			<div className="pitch" style={{ left: x, top: y, height, width }} >
				<svg className="pitch-svg" ref="svg">
					<Field width={ this.state.width } height={ this.state.height } />
				</svg>
				{ this.renderPlayers('home_team') }
				{ this.renderPlayers('quest_team') }
				{ this.renderComment() }
				<PlayerDragPreview></PlayerDragPreview>
			</div>
		)
	}
}