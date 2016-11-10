import { FETCH_STADIUMS } from '../actions/index';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_STADIUMS:
			return action.payload.data.stadiums.map((stadium) => {
				return {
					label: `${stadium.stadium}, ${stadium.City}`,
					value: stadium.id
				}
			});
		default:
			return state;
	}
}