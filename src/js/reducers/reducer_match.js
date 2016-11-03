import { FETCH_MATCH, UPDATE_MATCH_TEAM } from '../actions/index';

const INITIAL_STATE = null;

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_MATCH:

			const { home_team, quest_team, ...match } = action.payload.data.match;

			return {
				...state,
				home_team,
				quest_team,
				match: { ...match }
			};
		case UPDATE_MATCH_TEAM:
			const team = action.payload;
			return { ...state, ...team };
		default:
			return state;
	}
}