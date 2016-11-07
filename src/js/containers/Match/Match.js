import './Match.scss';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { fetchMatch, updateMatchTeam } from '../../actions/index';

import Icon from '../../components/Icon.js';
import Pitch from '../../components/Pitch/Pitch.js';
import Reserve from '../../components/Reserve/Reserve.js';
import AddPlayerForm from '../../components/AddPlayerForm/AddPlayerForm.js';

import Player from '../../components/Player/Player.js';
import PlayerNote from '../../components/Player/PlayerNote.js';

class Match extends Component {

	constructor () {
		super();
		this.state = {
			activeTab: 'Players',
			tabs: [ 'Players', 'Players note', 'Teams note' ],
			addPlayer: {
				home_team: false,
				quest_team: false
			},
			noteTeams: {
				home_team: '',
				quest_team: ''
			}
		}
	}

	componentDidMount() {
		this.props.fetchMatch({
			id: this.props.params.match_id
		}).then(() => {
			const { home_team, quest_team } = this.props.match;

			if (home_team.note || quest_team.note) {
				this.setState({
					noteTeams: {
						home_team: decodeURIComponent(home_team.note) || '',
						quest_team: decodeURIComponent(quest_team.note) || ''
					}
				});
			}
		});
	}

	renderPlayers(team_name) {
		return this.props.match[team_name].items.map((player, key) =>
			<Player
				className={ team_name }
				key={ key }
				player={ player }
				team_name={ team_name }
				match={ this.props.match }
			/>
		)
	};

	renderNotePlayers(team) {
		return this.props.match[team].items.map((player, key) => {

			var noteSave = (note) => {
				var toSave = {
					match_id: this.props.params.match_id
				};

				toSave[team] = _.cloneDeep(this.props.match[team]);

				var values = toSave[team].items[key].values;

				for (var i = 0, l = values.length; i < l; i++) {
					if (values[i].name === 'comment' && values[i].value !== note) {
						values[i].value = note;
						this.props.updateMatchTeam({...toSave});
						this.forceUpdate();
					}
				}
			};

			return (
				<PlayerNote
					key={ key }
					player={ player }
					team={ team }
					save={ noteSave.bind(this) }
				/>
			);
		})
	}

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

	onAddNewPlayer({ team_name, player }) {
		var active = _.cloneDeep(this.state.addPlayer);
			active[team_name] = !active[team_name];

		var toSave = {};
			toSave['match_id'] = this.props.params.match_id;
			toSave[team_name] = _.cloneDeep(this.props.match[team_name]);
			toSave[team_name].items.push(player);

		this.props.updateMatchTeam({...toSave});
		this.setState({ addPlayer: active });
	}

	toggleActivateAddPlayer(team) {
		var active = _.cloneDeep(this.state.addPlayer);
			active[team] = !active[team];

		this.setState({ addPlayer: active });
	}

	teamNoteChange(team_name, value) {
		var note = _.cloneDeep(this.state.noteTeams);
			note[team_name] = value;

		this.setState({
			noteTeams: note
		});
	}

	teamNoteSave(team_name) {
		var toSave = {};
			toSave['match_id'] = this.props.params.match_id;
			toSave[team_name] = _.cloneDeep(this.props.match[team_name]);
			toSave[team_name].note = encodeURIComponent(this.state.noteTeams[team_name]);

		this.props.updateMatchTeam({...toSave});
	}

	renderTab() {
		const { match } = this.props;

		switch (this.state.activeTab) {
			case 'Players':
				return (
					<div className="match-teams">
						<div className={ `team-left ${this.state.addPlayer.home_team ? 'add-player-active' : ''}` }>
							<div className="team-name">
								{ match.home_team.team_name }
								<a className="add-player" onClick={ this.toggleActivateAddPlayer.bind(this, 'home_team') } href="#">+</a>
							</div>
							<AddPlayerForm team_name='home_team' onCancel={ this.toggleActivateAddPlayer.bind(this, 'home_team') } onAddNewPlayer={ this.onAddNewPlayer.bind(this) } numbersReserved={ this.props.match['home_team'].items.map(item => item.number) } />
							<div className="team-list">
								{ this.renderPlayers('home_team') }
							</div>
						</div>
						<div className={ `team-right ${this.state.addPlayer.quest_team ? 'add-player-active' : ''}` }>
							<div className="team-name">
								{ match.quest_team.team_name }
								<a className="add-player" onClick={ this.toggleActivateAddPlayer.bind(this, 'quest_team') } href="#">+</a>
							</div>
							<AddPlayerForm team_name='quest_team' onCancel={ this.toggleActivateAddPlayer.bind(this, 'quest_team') } onAddNewPlayer={ this.onAddNewPlayer.bind(this) } numbersReserved={ this.props.match['quest_team'].items.map(item => item.number) } />
							<div className="team-list">
								{ this.renderPlayers('quest_team') }
							</div>
						</div>
					</div>
				);
			case 'Players note':
				return (
					<div className="match-teams">
						<div className="team-left">
							<div className="team-name">{ match.home_team.team_name }</div>
							<div className="team-list">
								{ this.renderNotePlayers('home_team' ) }
							</div>
						</div>
						<div className="team-right">
							<div className="team-name">{ match.quest_team.team_name }</div>
							<div className="team-list">
								{ this.renderNotePlayers('quest_team' ) }
							</div>
						</div>
					</div>
				);
			case 'Teams note':
				return (
					<div className="match-teams">
						<div className="team-left">
							<div className="team-name">{ match.home_team.team_name }</div>
							<div className="team-list">
								<textarea value={ this.state.noteTeams.home_team } onChange={ event => this.teamNoteChange('home_team', event.target.value) } onBlur={ this.teamNoteSave.bind(this, 'home_team') } className="team-note" placeholder={ `Note for ${match.home_team.team_name}` }></textarea>
							</div>
						</div>
						<div className="team-right">
							<div className="team-name">{ match.quest_team.team_name }</div>
							<div className="team-list">
								<textarea value={ this.state.noteTeams.quest_team } onChange={ event => this.teamNoteChange('quest_team', event.target.value) } onBlur={ this.teamNoteSave.bind(this, 'quest_team') } className="team-note" placeholder={ `Note for ${match.quest_team.team_name}` }></textarea>
							</div>
						</div>
					</div>
				);
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
							{ `${ match.home_team.stadion_name }, ${ match.match.location } | ${ moment(match.match.date).format('DD.MM.YYYY HH:mm') }` }
						</div>
					</div>
					{ this.renderTab() }
					<ul className="match-tabs">
						{ this.renderTabsList() }
					</ul>
				</div>
				<div className="right-col">
					{ /*<Reserve {...this.props} />*/ }
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
	delayTouchStart: 500,
	delayMouseStart: 100
}))(Match);

export default connect(mapStateToProps, { fetchMatch, updateMatchTeam })(initDragAndDrop);