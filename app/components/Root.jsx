import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import {Link, Route, Switch} from 'react-router-dom';
import SendMessage from './SendMessage';
import MessageInbox from './MessageInbox';
import MessageOutbox from './MessageOutbox';
import AccountView from './AccountView';
import SignupUser from './SignupUser';
import {fetchCurrentUser, logoutUser} from '../reducers/reducers_login_user';
import { Image, Segment, Menu, Header, Container, Button, Visibility, Icon, MenuItem } from 'semantic-ui-react'
import LoginUser from './LoginUser'
import MainBody from './MainBody'
import StatsView from './StatsView'
import Typist from 'react-typist';
import PaypalSignupMK from './PaypalSignupMK';
import StripeSignupMK from './StripeSignupMK';

class Root extends Component {
  componentDidMount() {
    this.props.fetchInitialData()
  }



  render() {
    console.log( Object.keys(this.props.login).length)
    const link = this.props.location.pathname.slice(1);
    console.log("RENDER TRIGGERED")
    return(
        <Segment
        inverted
        textAlign='center'
        style={{ minHeight: 700, padding: '1em 0em' }}
        vertical
      >
        <Container>
          <Menu inverted pointing secondary size='large'>
            <MenuItem active={!link.length}><Link to='/'>Home</Link></MenuItem>
            <MenuItem active={link==='inbox'}><Link to='/inbox'>Inbox</Link></MenuItem>
            <MenuItem active={link==='outbox'}><Link to='/outbox'>Outbox</Link></MenuItem>
            <MenuItem active={link==='stats'}><Link to='/stats'>Stats</Link></MenuItem>
            {
              this.props.login.currentUser.email ?
              <MenuItem active={link==='paypal'}><Link to='/paypal'>Add Paypal</Link></MenuItem>
              : null
            }
            {
              this.props.login.currentUser.email ?
              <MenuItem active={link==='stripe'}><Link to='/stripe'>Add Stripe</Link></MenuItem>
              : null
            }
            <MenuItem><a href="https://github.com/ShmuelLotman/BitText">Github Source</a></MenuItem>
            <MenuItem position='right'>
            {
              !this.props.login.currentUser.email  ? <Link to='/login'><Button inverted>Log in</Button></Link>
              : <Button inverted onClick={() => this.props.logout()}>Log Out</Button>
            } 
            {
              !this.props.login.currentUser.email  ? <Link to='/signup'><Button inverted>Sign Up</Button></Link>
              : <Link to='/account'><Button style={{ marginLeft: '0.5em' }} inverted>Account</Button></Link>
            } 
              
            </MenuItem>
          </Menu>
        </Container>
          <Switch>
            <Route exact path='/' render={() => <MainBody {...this.props.login.currentUser} />} />
            <Route exact path='/sendMessage' component={SendMessage} />
            <Route exact path='/inbox'  component={MessageInbox} />
            <Route exact path='/outbox' component={MessageOutbox} />
            <Route exact path='/signup' component={SignupUser} />
            <Route exact path='/login' component={LoginUser} />
            <Route exact path='/account' component = {AccountView} />
            <Route exact path='/stats' component = {StatsView} />
            <Route exact path='/paypal' render={ () => <PaypalSignupMK user={this.props.login.currentUser.email}/>} />
            <Route exact path='/stripe' render={ () => <StripeSignupMK user={this.props.login.currentUser.email}/>} />
          </Switch>
      </Segment>
    )
  }
}
const mapState = ({login}) => ({login})
const mapDispatch = dispatch => ({
  fetchInitialData: () => {
    dispatch(fetchCurrentUser());
  },
  logout() {
    dispatch(logoutUser())
  }
});

export default withRouter(connect(mapState, mapDispatch)(Root))