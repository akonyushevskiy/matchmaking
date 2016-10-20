import './Pitch.scss';

import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import * as d3 from "d3";
import { connect } from 'react-redux';

import { updateMatchTeam } from '../../actions/index';

import Controls from './PitchControls.js';
import Field from './PitchField.js';

const Types = {
	PLAYER: 'player'
};

const getPitchSize = () => {
	const aspect = 0.666666666666667;
	const margin = 20;
	const width = window.innerWidth/2;
	const height = window.innerHeight;

	if (width > height * aspect) {
		return {
			width: height * aspect - margin * 2,
			height: height - margin * 2
		};
	} else {
		return {
			width: width - margin * 2,
			height: width / aspect - margin * 2
		};
	}
};

const Target = {
	drop(props, monitor, component) {

		const { player, team } = monitor.getItem();

		if (!player.active) {
			const { width, height } = component.state;
			const PitchX = (window.innerWidth / 2 - width) / 2;
			const PitchY = (window.innerHeight - height) / 2;
			const { x, y } = monitor.getClientOffset();
			const [ left, top ] = [(x - window.innerWidth / 2 - PitchX) / width, (y - PitchY) / height];
			const selectedTeam = _.cloneDeep(props.match[team]);
			const toSave = { match_id: props.params.match_id };

			selectedTeam.items = selectedTeam.items.map((item) => {
				if (item.number === player.number) {
					item.active = true;
					item.offset = {left, top}
				}
				return item;
			});

			toSave[team] = selectedTeam;
			props.updateMatchTeam({...toSave});
		}
	}
};

class Pitch extends Component {

	static propTypes = {
		connectDropTarget: PropTypes.func.isRequired
	};

	constructor() {
		super();

		const { width, height } = getPitchSize();
		const [ playerControls, activeInner, activeOuter, activeTeam, comment, commentActive ] = [null, false, false, null, '', false];

		this.state = { width, height, playerControls, activeInner, activeOuter, activeTeam, comment, commentActive };

		this.resizeHandler = this.resizeHandler.bind(this);
	}

	resizeHandler() {
		const { width, height } = getPitchSize();
		this.setState({ width, height });
	}

	renderPlayers(team) {

		const { width, height } = this.state;

		const clickHandler = (key, event) => {
			event.stopPropagation();

			this.setState({
				playerControls: key,
				activeInner: true,
				activeTeam: team,
				activeOuter: false,
				commentActive: false
			});
		};

		const clickInnerControlHandler = (player, control) => {
			this.setState({
				activeOuter: control,
				commentActive: false
			});
		};

		const clickOuterControlHandler = (player, value) => {
			const selectedTeam = _.cloneDeep(this.props.match[team]);

			selectedTeam.items[player].values[this.state.activeOuter].value = value;

			const toSave = {
				match_id: this.props.params.match_id
			};

			toSave[team] = selectedTeam;

			this.props.updateMatchTeam({...toSave});
		};

		const onAddComment = (comment) => {
			this.setState({
				commentActive: true,
				activeOuter: false,
				comment
			})
		};

		return this.props.match[team].items.map((player, key) => {
			if (!player.active) return null;

			return (
				<g
					key= {key}
					className={ `pitch-player ${team}`}
					data-team={ team }
					data-player={ key }
					transform= {`translate(${width * player.offset.left}, ${height * player.offset.top})`}
				>
					<circle r="20" onClick={ clickHandler.bind(this, key) } />
					<text transform={`translate(0, 8)`}>{ player.number }</text>
					{
						(key === this.state.playerControls && team === this.state.activeTeam) &&
						<Controls
							controls={ player.values }
							{ ...this.state }
							onClickInner={ clickInnerControlHandler.bind(this, key) }
							onClickOuter={ clickOuterControlHandler.bind(this, key) }
							onAddComment={ onAddComment.bind(this) }
							/>
					}
				</g>
			)
		});
	}

	initDragEvents() {
		const { width, height } = this.state;

		var pressTimer;
		var pressActive = false;

		const dragPitchPlayers = d3.drag()
			.on('start', (event, i, list) => {
				const animateCircle = () => pressActive && d3.select(list[i]).select('circle').transition().duration(200).attr('r', 25);
				setTimeout(() => {
					animateCircle();
				}, 500);
			})
			.on("drag", (event, i, list) => {
				pressActive && d3.select(list[i]).attr('transform', `translate(${d3.event.x}, ${d3.event.y})`)
			})
			.on("end", (event, i, list) => {
				if (pressActive) {
					const $player = d3.select(list[i]);
					const team = $player.attr('data-team');
					const player_key = parseInt($player.attr('data-player'));
					const [ left, top ] = [d3.event.x / width, d3.event.y / height];
					const selectedTeam = _.cloneDeep(this.props.match[team]);
					const toSave = { match_id: this.props.params.match_id };

					$player.select('circle').transition().duration(200).attr('r', 20);

					if (left > 0 && left < 1 && top > 0 && top < 1) {
						selectedTeam.items[player_key].offset = {left, top};
						selectedTeam.items[player_key].active = true;
					} else {
						selectedTeam.items[player_key].offset = { left: null, top: null };
						selectedTeam.items[player_key].active = false;
					}

					toSave[team] = selectedTeam;
					this.props.updateMatchTeam({...toSave});
				}

				pressActive = false;
				clearTimeout(pressTimer);
			});

		d3.selectAll(".pitch-player")
			.on('mousedown', () => {
				pressTimer = window.setTimeout(() => {
					pressActive = true;
				}, 500);
			})
			.on('mouseout', () => {
				if (!pressActive) {
					clearTimeout(pressTimer);
				}
			})
			.on('touchstart', (event) => {
				pressTimer = window.setTimeout(() => {
					pressActive = true;
				}, 500);
			})
			.on("touchmove", (event) => {
				d3.event.preventDefault();
				if (!pressActive) {
					clearTimeout(pressTimer);
				}
			});


		d3.selectAll(".pitch-player").call(dragPitchPlayers);
	}

	componentDidMount() {
		this.initDragEvents();

		window.addEventListener('resize', this.resizeHandler);
	}

	componentDidUpdate() {
		this.initDragEvents();
	}

	componentWillUnmount() {
		d3.selectAll(".pitch-player")
			.on('mousedown', null)
			.on('mouseout', null);

		window.removeEventListener('resize', this.resizeHandler);
	}

	svgClickHandler () {
		const [ playerControls, activeInner, activeOuter, activeTeam, commentActive ] = [null, false, false, null, false];
		this.setState({ playerControls, activeInner, activeOuter, activeTeam, commentActive });
	}

	onCommentChange(comment) {
		this.setState({comment});
	}

	saveComment() {
		const { match, params, updateMatchTeam } = this.props;
		const { activeTeam, playerControls, comment } = this.state;
		const selectedTeam = _.cloneDeep(match[activeTeam]);


		selectedTeam.items[playerControls].values.map((value, key) => {
			if (value.name === 'comment') {
				return value.value = comment;
			}
			return value;
		});

		const toSave = {
			match_id: params.match_id
		};

		toSave[activeTeam] = selectedTeam;

		updateMatchTeam({...toSave});

		this.setState({
			commentActive: false
		});
	}

	renderComment () {
		return (
			<div className={ `pitch-comment ${this.state.commentActive ? 'active' : ''}` }>
				<input className="input" type="text" placeholder="Type here..." value={this.state.comment} onChange={event => this.onCommentChange(event.target.value)} />
				<button className="btn btn-green" onClick={ this.saveComment.bind(this) }>Save</button>
			</div>
		);
	}

	render () {

		const { connectDropTarget } = this.props;
		const { width, height } = this.state;

		const x = (window.innerWidth / 2 - width) / 2;
		const y = (window.innerHeight - height) / 2;

		return connectDropTarget(
			<div
				className="pitch"
				style={{ left: x, top: y, height, width }}
				>
				<svg className="pitch-svg" ref="svg" onClick={ this.svgClickHandler.bind(this) }>
					<Field width={ this.state.width } height={ this.state.height } />
					{ this.renderPlayers('home_team') }
					{ this.renderPlayers('quest_team') }
				</svg>
				{ this.renderComment() }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return { match: state.match };
}

const initDragAndDrop = DropTarget(Types.PLAYER, Target, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget()
}))(Pitch);

export default connect(mapStateToProps, { updateMatchTeam })(initDragAndDrop);