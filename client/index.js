import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'
import {BrowserRouter as Router} from 'react-router-dom';
import Main from './components/main'
//import Routes from './routes'

// establishes socket connection
//import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>,
  document.getElementById('app')
)
