import { FETCH_POSITIONS } from '../actions/index';

const INITIAL_STATE = [];

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
		case FETCH_POSITIONS:
			return action.payload.data.positions.map((position) => {
				return {
					label: position.desc_short,
					value: position.id
				}
			});
		default:
			return state;
	}
}