import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import reducerMatches from './reducer_matches';
import reducerTeams from './reducer_teams';
import reducerMatch from './reducer_match';

const rootReducer = combineReducers({
	matches: reducerMatches,
	teams: reducerTeams,
	match: reducerMatch,
	form: formReducer
});

export default rootReducer;
