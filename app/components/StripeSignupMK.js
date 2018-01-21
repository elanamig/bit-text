import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {withRouter} from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addPaymentTypetoAccount } from '../reducers/reducers_connect_payments';
import Paper from 'material-ui/Paper'
import {Container } from 'semantic-ui-react'
class StripeSignupMK extends Component {
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
      this.props.addPayment(values.authkey, values.password, values.isDefault)
    }
    render() { 
        console.log(this.props, 'paypal props')
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
        return this.props.user ? 
         (
            
            <Container style={containerStyle}>
                <Paper style={style} zDepth={3}>
                    <form style={formStyle} onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                        <Field 
                            name="authkey"
                            label="Stripe Authkey"
                            type="text"
                            component={this.renderField}
                        />
                        <Field 
                            name="password"
                            label="Stripe Password"
                            type="password"
                            component={this.renderField}
                        />
                        <Field 
                            name="isDefault"
                            label="Set this account as default?"
                            type= "text"
                            component={this.renderField}
                        />

                        {this.props.loginErr && <strong>Invalid username or password!</strong>}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </Paper>
            </Container> ) : <h1>please sign in to add payment type</h1>
        
    }
}

const validate = (values) => {
    const errors = {};
    //validate inputs
    //if errors is empty, form will continue; otherwise, it will return the error
    if(!values.authkey) {
        errors.email = "enter email"
    }
    if(!values.password) {
        errors.password = 'enter some password please!'
    }
    if(!values.isDefault) {
        errors.isDefault = 'please choose to set as default by saying yes or no'
    }
    return errors
}
const mapDispatch = (dispatch, ownProps) => {
    return {
        addPayment(authkey, password, isDefault) {
            if(isDefault === 'yes') isDefault = true 
            else isDefault = false
            dispatch(addPaymentTypetoAccount({authkey, password, isDefault, platform: 'STRIPE'}, ownProps.history))
        }
    }
}

export default reduxForm({
    form: 'LoginUser',
    validate
})(
    withRouter(connect(null, mapDispatch)(StripeSignupMK))
)