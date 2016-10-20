import { FETCH_MATCHES, FETCH_ADD_MATCH, UPDATE_MATCH } from '../actions/index';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_MATCHES:
			return action.payload.data.matches;
		case FETCH_ADD_MATCH:
			return [ ...state, action.payload.data.match ];
		case UPDATE_MATCH:

			state = state.map((match) => {
				console.log(match._id === action.payload.data.match._id);
				if (match._id === action.payload.data.match._id) {
					return action.payload.data.match;
				}
				return match;
			});

			return [ ...state ];
		default:
			return state;
	}
}