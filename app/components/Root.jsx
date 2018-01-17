import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import SendMessage from './SendMessage';
import MessageInbox from './MessageInbox';
import SignupUser from './SignupUser';
import {fetchCurrentUser} from '../reducers/reducers_login_user';
class Root extends Component {
  componentDidMount() {
    this.props.fetchInitialData()
  }
  render() {
    return(
      <div>
      <h1>Hello</h1>
      <Link to='/messages'>Go To Send Messages</Link>
      <Link to='/inbox'>Go To Inbox</Link>
      <Link to='/signup'>Sign Up</Link>
      {
        Object.keys(this.props.login).length === 0 && <Link to='/login'>Log In</Link>
      }
      </div>
      
    )
  }
}
const mapState = ({login}) => ({login})
const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(fetchCurrentUser());
  }
});

export default connect(mapState, mapDispatch)(Root)