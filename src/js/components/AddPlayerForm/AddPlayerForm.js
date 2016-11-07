import './AddPlayerForm.scss';

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import { connect } from 'react-redux';

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
	<input {...input} placeholder={label} type={type} className={ `${ (touched && error) ? 'no-valid' : '' }` }/>
);

class AddPlayerForm extends Component {

	onSubmit(formValues) {
		var player = _.cloneDeep(formValues);
			player.number = parseInt(player.number);
			player.reserve = false;
			player.active = false;
			player.offset = {
				left: null,
				top: null
			};
			player.values = [{
				name: 'goal',
				active: false,
				value: null
			},{
				name: 'pass',
				active: false,
				value: null
			},{
				name: 'tackle',
				active: false,
				value: null
			},{
				name: 'comment',
				active: false,
				value: null
			},{
				name: 'technique',
				active: false,
				value: null
			},{
				name: 'speed',
				active: false,
				value: null
			}];

		this.props.onAddNewPlayer({
			team_name: this.props.team_name,
			player
		});

		setTimeout(this.props.reset, 0);
	}

	cancelHandler() {
		this.props.onCancel();
	}

	render() {
		const { handleSubmit } = this.props;

		return (
			<form className="add-player-form" onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
				<fieldset>
					<label>Full Name</label>
					<Field name="name" component="input" type="text" placeholder="Player full name" component={ renderField }/>
				</fieldset>
				<fieldset className="fieldset--1-3">
					<label>Number</label>
					<Field name="number" component="input" type="number" placeholder="Player number" component={ renderField }/>
				</fieldset>
				<fieldset className="fieldset--2-3">
					<label>Position</label>
					<Field name="position" component="input" type="text" placeholder="Player position" component={ renderField }/>
				</fieldset>
				<fieldset className="fieldset--2-3 text-right">
					<a href="#" className="btn" onClick={ this.cancelHandler.bind(this) }>Cancel</a>
				</fieldset>
				<fieldset className="fieldset--1-3">
					<button type="submit" className="btn btn-green btn-block">Add</button>
				</fieldset>
			</form>
		)
	}
}

const validate = (values, props) => {
	const errors = {};

	if (!values.name) { errors.name = 'Required'; }
	if (!values.number) { errors.number = 'Required'; }
	if (!values.position) { errors.position = 'Required'; }

	for (var i = 0, l = props.numbersReserved.length; i < l; i++) {
		if (props.numbersReserved[i] == values.number) {
			errors.number = 'Duplicate number';
			break;
		}
	}

	return errors
};

const InitializeForm = reduxForm({ validate })(AddPlayerForm);

function mapStateToProps(state, props) {
	return {
		form: `addPlayer${props.team_name}`
	};
}

export default connect(mapStateToProps, null)(InitializeForm);
