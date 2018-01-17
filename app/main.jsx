'use strict'
import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import store from './store/index'
import Root from './components/Root'
import SendMessage from './components/SendMessage'
import MessageInbox from './components/MessageInbox'
import SignupUser from './components/SignupUser'
import LoginUser from './components/LoginUser'
ReactDOM.render(
  <Provider store={store}>
    <Router>
     <Switch>
      <Route exact path='/' component={Root}/>
      <Route exact path='/sendMessage' component={SendMessage} />
      <Route exact path='/inbox' component={MessageInbox} />
      <Route exact path='/signup' component={SignupUser} />
      <Route exact path='/login' component={LoginUser} />
     </Switch>
    </Router>
   
  </Provider>,
  document.getElementById('main')
)