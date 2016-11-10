import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import reducerMatches from './reducer_matches';
import reducerTeams from './reducer_teams';
import reducerMatch from './reducer_match';
import reducerPositions from './reducer_positions';
import reducerStadiums from './reducer_stadiums';

const rootReducer = combineReducers({
	matches: reducerMatches,
	teams: reducerTeams,
	match: reducerMatch,
	form: formReducer,
	positions: reducerPositions,
	stadiums: reducerStadiums
});

export default rootReducer;
