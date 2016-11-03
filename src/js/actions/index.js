import axios from 'axios';

export const FETCH_SIGNIN = "FETCH_SIGNIN";
export const FETCH_SIGNUP = "FETCH_SIGNUP";
export const FETCH_MATCHES = "FETCH_MATCHES";
export const FETCH_MATCH = "FETCH_MATCH";
export const FETCH_TEAMS = "FETCH_TEAMS";
export const FETCH_ADD_MATCH = "FETCH_ADD_MATCH";
export const UPDATE_MATCH_TEAM = "UPDATE_MATCH_TEAM";
export const UPDATE_MATCH = "UPDATE_MATCH";
export const DELETE_MATCH = "DELETE_MATCH";

export var ROOT_URL = 'http://localhost:8080';

if (process.env.NODE_ENV !== 'production') {
	ROOT_URL = 'http://localhost:8080';
}

export function signIn(props) {
	const request = axios.post(`${ROOT_URL}/login`, props);

	return {
		type: FETCH_SIGNIN,
		payload: request
	}
}

export function signUp(props) {
	const  request = axios.post(`${ROOT_URL}/registration`, props);

	return {
		type: FETCH_SIGNUP,
		payload: request
	}
}

export function fetchMatches(props) {
	const  request = axios.get(`${ROOT_URL}/matches`, {
		params: props
	});

	return {
		type: FETCH_MATCHES,
		payload: request
	}
}

export function deleteMatch(props) {
	const  request = axios.delete(`${ROOT_URL}/matches`, {
		params: props
	});

	return {
		type: DELETE_MATCH,
		payload: request
	}
}

export function fetchTeams(props) {
	const request = axios.get(`${ROOT_URL}/teams`, {
		params: props
	});

	return {
		type: FETCH_TEAMS,
		payload: request
	}
}

export function fetchMatch(props) {
	const request = axios.get(`${ROOT_URL}/match`, {
		params: props
	});

	return {
		type: FETCH_MATCH,
		payload: request
	}
}

export function updateMatch(props) {
	const request = axios.post(`${ROOT_URL}/match`, {
		...props
	});

	return {
		type: UPDATE_MATCH,
		payload: request
	}
}

export function updateMatchTeam(props) {
	axios.post(`${ROOT_URL}/match/`, {
		...props
	});

	delete props['match_id'];

	return {
		type: UPDATE_MATCH_TEAM,
		payload: Promise.resolve(props)
	}
}

export function fetchAddMatch(props) {
	const  request = axios.post(`${ROOT_URL}/add_match`, {
		...props
	});

	return {
		type: FETCH_ADD_MATCH,
		payload: request
	}
}