'use strict'
import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom';
import store from './store/index'
import Root from './components/Root'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
ReactDOM.render(
  <Provider store={store}> 
      <MuiThemeProvider>
        <Router>
            <Root/>
        </Router>
      </MuiThemeProvider>
  </Provider>,
  document.getElementById('main')
)
//
//