import { FETCH_TEAMS } from '../actions/index';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_TEAMS:
			return action.payload.data.teams.map((team) => {
				return {
					label: team.team_name,
					value: team.team_id,
					stadium_id: team.stadium_id
				}
			});
		default:
			return state;
	}
}