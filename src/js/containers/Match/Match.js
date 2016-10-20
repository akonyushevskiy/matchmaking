import './Match.scss';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { fetchMatch } from '../../actions/index';
import { updateMatchTeam } from '../../actions/index';

import Icon from '../../components/Icon.js';
import Pitch from '../../components/Pitch/Pitch.js';

import Player from '../../components/Player/Player.js';

class Match extends Component {

	constructor () {
		super();
		this.state = {
			activeTab: 'Players',
			tabs: [ "Players", "Note" ],
			note: ''
		}
	}

	componentWillMount() {
		this.props.fetchMatch({
			id: this.props.params.match_id
		}).then(() => {
			this.setState({ note: this.props.match.match.note || '' });
		});
	}

	renderPlayers(team, players) {
		return players.map((player, key) =>
			<Player
				className={ team }
				key={ key }
				player={ player }
				team={team}
			/>
		)
	};

	renderTabsList() {
		const setActiveTab = activeTab => {
			this.setState({ activeTab });
		};

		return this.state.tabs.map((tab, key) => {
			return (
				<li key={key} onClick={ setActiveTab.bind(this, tab) } className={ this.state.activeTab === tab ? "active" : "" }><a href="#">{ tab }</a></li>
			)
		})
	}

	onNoteChange(note) {
		this.setState({note});
	}

	onNoteSave(event){
		this.props.updateMatchTeam({
			match_id: this.props.params.match_id,
			note: this.state.note
		})
	}

	renderTab() {
		const { match } = this.props;

		switch (this.state.activeTab) {
			case 'Players':
				return (
					<div className="match-teams">
						<div className="team-left">
							<div className="team-name">{ match.home_team.team_name }</div>
							<div className="team-list">
								{ this.renderPlayers('home_team', match.home_team.items ) }
							</div>
						</div>
						<div className="team-right">
							<div className="team-name">{ match.quest_team.team_name }</div>
							<div className="team-list">
								{ this.renderPlayers('quest_team', match.quest_team.items ) }
							</div>
						</div>
					</div>
				);
			case 'Note':
				return (
					<div className="match-comment">
						<textarea placeholder="Note" value={ this.state.note } onChange={event => this.onNoteChange(event.target.value)}></textarea>
						<button type="submit" className="btn btn-green" onClick={ this.onNoteSave.bind(this) }>Save</button>
					</div>
				)
		}
	}

	render () {
		const { match } = this.props;

		if (!match) return <div>Loading...</div>;

		return (
			<div className="match">
				<div className="left-col">
					<div className="match-header">
						<Link className="back" to="/">
							<Icon name="arrow"></Icon>
						</Link>
						<div className="logos">
							<img src={ `../images/${ match.home_team.team_id }.jpg` } alt=""/>
							<img src={ `../images/${ match.quest_team.team_id }.jpg` } alt=""/>
						</div>
						<div className="name">
							{ `${ match.home_team.team_name } – ${ match.quest_team.team_name }` }
						</div>
						<div className="desc">
							{ `${ match.home_team.stadion_name }, ${ match.match.location } | ${ moment(match.match.date).format('DD.MM.YYYY HH:MM') }` }
						</div>
					</div>
					{ this.renderTab() }
					<ul className="match-tabs">
						{ this.renderTabsList() }
					</ul>
				</div>
				<div className="right-col">
					<Pitch {...this.props} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { match: state.match };
}

const initDragAndDrop = DragDropContext(TouchBackend({
	enableMouseEvents: true,
	delayTouchStart: 500
}))(Match);

export default connect(mapStateToProps, { fetchMatch, updateMatchTeam })(initDragAndDrop);