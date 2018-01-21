import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import { postUser } from '../reducers/reducers_add_user';
import store from '../store';
import Paper from 'material-ui/Paper'
import {Container } from 'semantic-ui-react'
import { loginUser } from '../reducers/reducers_login_user';
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
      this.props.loginuser(values)
    }
    render() { 
        const { handleSubmit } = this.props;
        console.log(this.props, 'signupprops')
        const style = {
            height: 480,
            width: 350,
            margin: 'auto',
            textAlign: 'center',
          };

        const formStyle ={
            padding: '3em',
        }

        const containerStyle = {
            padding: '4em'
        }

        return (
            <Container style={containerStyle}>
                <Paper style={style} zDepth={3}>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))} style={formStyle}>
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
            </Paper>
            </Container>
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
const mapDispatch = (dispatch, ownProps) => {
    return {
        loginuser(user) {
            dispatch(loginUser(user, ownProps.history, 'signup'))
        }
    }
}
export default reduxForm({
    form: 'SignupUser',
    validate
})(
    withRouter(connect(mapDispatch, null)(SignupUser))
)

