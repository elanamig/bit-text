import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postUser } from '../reducers/reducers_add_user';
import store from '../store';
class SignupUser extends Component {
    renderField(field) {
        const { meta: {touched, error} } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`
        return (
            <div className={className}>
                <label>{field.label}</label>
                <input
                    className="form-control"
                    type="text"
                    {...field.input}
                />
                <div className="text-help">
                {touched === true && error}
                </div>
            </div>
        )
    }
    onSubmit(values) {
      const postAction =  postUser(values);
        store.dispatch(postAction)
    }
    render() { 
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field 
                    name="fullName"
                    label="Full Name"
                    component={this.renderField}
                />
                <Field 
                    name="email"
                    label="Email Address"
                    component={this.renderField}
                />
                <Field 
                    name="password"
                    label="Password"
                    component={this.renderField}
                />
                <Field 
                    name="countryCode"
                    label="Country Code"
                    component={this.renderField}
                />
                <Field 
                    name="phone"
                    label="Cell Phone Number"
                    component={this.renderField}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

const validate = (values) => {
    const errors = {};
    //validate inputs
    //if errors is empty, form will continue; otherwise, it will return the error
    if(!values.fullName) {
        errors.fullName = "enter a proper full name!"
    }
    if(!values.email) {
        errors.email = "enter email"
    }
    if(!values.password) {
        errors.password = 'enter some password please!'
    }
    if(!values.countryCode) {
        errors.countryCode = 'country code must be entered'
    }
    if(!values.phone) {
        errors.phone = 'please enter a cell number!'
    }
    return errors
}
export default reduxForm({
    form: 'SignupUser',
    validate
})(
    connect(null, null)(SignupUser)
)