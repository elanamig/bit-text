import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../reducers/reducers_login_user';
class LoginUser extends Component {
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
        console.log(this.props)
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
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
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}

const validate = (values) => {
    const errors = {};
    //validate inputs
    //if errors is empty, form will continue; otherwise, it will return the error
    if(!values.email) {
        errors.email = "enter email"
    }
    if(!values.password) {
        errors.password = 'enter some password please!'
    }
    return errors
}
const mapDispatch = (dispatch, ownProps) => {
    return {
        loginuser(user) {
            dispatch(loginUser(user, ownProps.history))
        }
    }
}
export default reduxForm({
    form: 'LoginUser',
    validate
})(
    connect(null, mapDispatch)(LoginUser)
)