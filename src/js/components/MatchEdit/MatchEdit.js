import './MatchEdit.scss';
import './react-datepicker.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Field, reduxForm } from 'redux-form';
import MaskedInput from 'react-maskedinput';
import moment from 'moment';

//TODO: add to webpack production config, read https://github.com/Hacker0x01/react-datepicker/issues/347
//  module: {
//    noParse: /\.min\.js/
//  }
import DatePicker from 'react-datepicker/dist/react-datepicker';

import { fetchTeams } from '../../actions/index';

const cities = [
	{ value: 'London', label: 'London' },
	{ value: 'Moscow', label: 'Moscow' },
	{ value: 'Berlin', label: 'Berlin' },
	{ value: 'Hamburg', label: 'Hamburg' }
];

const fieldSelect = ({ input, ...rest }) => {
	return (
		<Select
			className={ rest.meta.touched && rest.meta.error ? 'no-valid' : '' }
			{...rest}
			name={ input.name }
			value={ input.value }
			clearable={ false }
			searchable={ true }
			onChange={ (value)=> {
				input.onChange(value.value);
			}}
			/>
	);
};

const fieldInput = ({input, ...rest}) => {
	return <MaskedInput {...input} {...rest} className={ `input ${rest.meta.touched && rest.meta.error ? 'no-valid' : ''}` } />
};

const fieldDatePicker = ({input, ...rest}) => {
	return <DatePicker {...input} {...rest} dateFormat="DD.MM.YYYY"  selected={ moment(input.value, "DD.MM.YYYY") } />
};


class MatchEdit extends Component {

	componentDidMount() {
		this.props.fetchTeams();
	}

	onSubmit(formValues) {
		this.props.onSubmit(formValues);
		if (this.props.title === 'Add new match') {
			setTimeout(this.props.reset, 0);
		}
	}

	onCancel() {
		this.props.onCancel();
	}

	renderLoader() {
		if (!this.props.loading) { return null; }
		return <div className="match-edit-loader" />;
	}

	render () {

		const { state, props } = this;
		const { handleSubmit, submitting, teams, onDelete } = props;

		return (
			<form className="match-edit" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				{ onDelete ? <a href="#" className="btn btn-no-pad btn-color-red" onClick={ onDelete.bind(this) }>Delete</a> : null }
				<div className="title">{ props.title }</div>
				<div className="fields clearfix">
					<div className="col-left">
						<fieldset className="fieldset--1-2">
							<label>HOME TEAM</label>
							<Field placeholder="Select or enter team name…" name="home_team" component={ fieldSelect } options={ teams } />
						</fieldset>
						<fieldset className="fieldset--1-2">
							<label>GUEST TEAM</label>
							<Field placeholder="Select or enter team name…" name="quest_team" component={ fieldSelect } options={ teams } />
						</fieldset>
						<fieldset className="fieldset--1-3">
							<label>Date</label>
							<Field className="input" name="date" mask="11.11.1111" component={ fieldDatePicker } placeholder="Enter match date…"/>
						</fieldset>
						<fieldset className="fieldset--1-3">
							<label>Starts at</label>
							<Field className="input" name="start" mask="11:11" component={ fieldInput } type="text" placeholder="Enter match date…"/>
						</fieldset>
						<fieldset className="fieldset--1-3">
							<label>location</label>
							<Field placeholder="Enter or select location…" name="location" component={ fieldSelect } options={ cities } />
						</fieldset>
					</div>
					<div className="col-right">
						<fieldset className="fieldset--1-2">
							<a href="#" onClick={ this.onCancel.bind(this) } className="btn btn-block">Cancel</a>
						</fieldset>
						<fieldset className="fieldset--1-2">
							<button type="submit" className="btn btn-green btn-block">Save</button>
						</fieldset>
					</div>
				</div>
				{ this.renderLoader() }
			</form>
		)
	}
}

const validate = values => {
	const errors = {};

	if (!values.home_team) { errors.home_team = 'Required'; }
	if (!values.quest_team) { errors.quest_team = 'Required'; }
	if (!values.date) { errors.date = 'Required'; }
	if (!values.start) { errors.start = 'Required'; }
	if (!values.location) { errors.location = 'Required'; }

	return errors
};

const InitializeForm = reduxForm({
	validate
})(MatchEdit);

function mapStateToProps(state, props) {

	if (!props.match) {
		return {
			teams: state.teams,
			form: 'addMatch',
			initialValues: {
				date: moment().format('DD.MM.YYYY'),
				start: '20:00'
			}
		};
	}

	const { _id ,home_team, quest_team, date, location } = props.match;

	return {
		teams: state.teams,
		form: `editMatch${_id}`,
		initialValues: {
			home_team: parseInt(home_team.team_id),
			quest_team: parseInt(quest_team.team_id),
			date: moment(date).format('DD.MM.YYYY'),
			start: moment(date).format('HH:mm'),
			location
		}
	};
}

export default connect(mapStateToProps, { fetchTeams })(InitializeForm);
