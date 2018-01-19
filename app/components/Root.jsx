import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import SendMessage from './SendMessage';
import MessageInbox from './MessageInbox';
import SignupUser from './SignupUser';
import {fetchCurrentUser, logoutUser} from '../reducers/reducers_login_user';
import { Image, Segment, Menu, Header, Container, Button, Visibility, Icon } from 'semantic-ui-react'

class Root extends Component {
  componentDidMount() {
    this.props.fetchInitialData()
  }
  render() {
    console.log( Object.keys(this.props.login).length)
    return(
      <div>
        <Segment
        inverted
        textAlign='center'
        style={{ minHeight: 700, padding: '1em 0em' }}
        vertical
      >
        <Container>
          <Menu inverted pointing secondary size='large'>
            <Menu.Item active>Home</Menu.Item>
            <Menu.Item><Link to='/inbox'>Inbox</Link></Menu.Item>
            <Menu.Item><Link to='/messages'>Go To Send Messages</Link></Menu.Item>
            <Menu.Item><a href="https://github.com/ShmuelLotman/BitText">Github Source</a></Menu.Item>
            <Menu.Item position='right'>
            {
              this.props.login.currentUser  ? <Link to='/login'><Button inverted>Log in</Button></Link>
              : <Button inverted onClick={() => this.props.logout()}>Log Out</Button>
            }  
              <Link to='/signup'><Button inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button></Link>
            </Menu.Item>
          </Menu>
        </Container>

        <Container text>
          <Header
            as='h1'
            content= 'WELCOME'
            inverted
            style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
          />
          <Header
            as='h2'
            content='Do whatever you want when you want to.'
            inverted
            style={{ fontSize: '1.7em', fontWeight: 'normal' }}
          />
          <Button primary size='huge'>
            Get Started
            <Icon name='right arrow' />
          </Button>
        </Container>
      </Segment>

      
      </div>

      
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

export default connect(mapState, mapDispatch)(Root)