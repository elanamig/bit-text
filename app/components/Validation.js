import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import store from '../store';
import Paper from 'material-ui/Paper'
import {Container } from 'semantic-ui-react'
import { loginUser } from '../reducers/reducers_login_user';
class Validation extends Component {

    render() { 
        console.log(this.props, 'signupprops')
        const style = {
            height: 300,
            width: 350,
            margin: 'auto',
            textAlign: 'center',
          };


        const containerStyle = {
            padding: '4em'
        }

        return (
            <Container style={containerStyle}>
                <Paper style={style} zDepth={3}>
                <h1>Your Validation Code is: {this.props.user.validationCode}</h1>
                <button onClick={() => this.props.history.push('/')} className="btn btn-primary">Confirm</button>
            </Paper>
            </Container>
        )
    }
}


const mapState = (state) => ({
    user: state.login.currentUser
})

  export default withRouter(connect(mapState, null)(Validation))


