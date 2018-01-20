import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {withRouter} from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../reducers/reducers_login_user';
import Paper from 'material-ui/Paper'
import {Container } from 'semantic-ui-react'
class LoginUser extends Component {
    renderField(field, password) {
        const { meta: {touched, error} } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`
        return (
            <div className={className}>
                <label>{field.label}</label>
                <input
                    className="form-control"
                    type={field.type}
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

        const style = {
            height: 275,
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
                    <form style={formStyle} onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <Field 
                            name="email"
                            label="Email Address"
                            type="text"
                            component={this.renderField}
                        />
                        <Field 
                            name="password"
                            label="Password"
                            type="password"
                            component={this.renderField}
                        />
                        {this.props.loginErr && <strong>Invalid username or password!</strong>}
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

const mapState = state => ({
    loginErr: state.login.loginErr
})
export default reduxForm({
    form: 'LoginUser',
    validate
})(
    withRouter(connect(mapState, mapDispatch)(LoginUser))
)