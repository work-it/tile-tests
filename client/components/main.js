import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {logout} from '../store'
import Search from './search/search'
import InterviewBoardContainer from './interview-container/interview-board-container'
import Questions from './questions/questions-container'
import Question from './questions/question'
import PracticeContainer from './practice-container/practice-container'
import SearchBar from './search-bar/search-bar'
import UserProfileContainer from './user-profile-form/user-profile-container'
import UserMenu from './user-container/user-container'
import UserChat from './user-chat/user-chat'
import JobView from './job-view/jobview'
import UserProfile from './user-profile-form/user-profile'
import { Login, Signup } from './auth/auth'
import {me} from '../store/user'
import history from './'
import UserFavorites from './user-favorites/user-favorites'
import Apply from './apply/apply'
import UserInProgress from './user-in-progress/user-in-progress';
import EmployerView from './employer-view/employer-view'
import PracticeMenu from './practice-menu/practice-menu'
import ProfileMenu from './profile-menu/profile-menu'
import PairPractice from './practice-pairs/practice-pairs'
import UserHome from './user-home'


class Main extends Component {
  constructor (props) {
    super(props)

    this.state = {}
    this.getApplicationsComponent = this.getApplicationsComponent.bind(this)
  }

  componentDidMount() {
    this.props.loadInitialData()
  }

  render () {
    const {showAuth, authView, isLoggedIn, handleLogout, employer} = this.props;
    return (
      <div id = "rootDiv">
        <SearchBar history={history} logout={handleLogout} />
        {showAuth && authView === 'signup' && <Signup />}
        {showAuth && authView === 'login' && <Login />}

        <Route path="/applications" render={() => <UserMenu /> } />
        <Route path="/profile" render={() => <ProfileMenu /> } />
        <Switch>
          {/* JOB ROUTES */}
          <Route exact path="/search" render={() => <Search /> } />
          <Route exact path="/search/saved" render={() => <UserFavorites /> } />
          <Route exact path="/job/:id" render={()=><JobView />} />
          <Route exact path="/apply/:id" render={()=><Apply history={history} />} />

          <Route exact path="/" render={() => <UserHome />} />

          {/* APPLICATION ROUTES */}
          {
            // this.props.employer?
            //   (<Route exact path="/applications/in-progress" render={ () => <EmployerView type="in-progress"/> } />)
            //   :
            //   (<Route exact path="/applications/in-progress" render={ () => <UserInProgress type="in-progress"/> } />)
          }

          <Route exact path="/applications/in-progress" render={ () => <UserInProgress type="in-progress"/>} />
          <Route exact path="/applications/archived" render={() =><UserInProgress type="archived" />} />

          {/* PROFILE ROUTES */}
          <Route exact path="/profile" render={()=><UserProfile />} />
          <Route exact path="/profile/edit" render={() => <UserProfileContainer /> } />
          <Route path="/profile/edit/:step" render={() => <UserProfileContainer /> } />

          {/* MESSAGE ROUTES */}
          <Route exact path="/messages" render={() => <UserChat /> } />

          {/* PRACTICE ROUTES */}
          <Route exact path="/practice/pair" render={() => <PairPractice /> } />
          <Route exact path="/practice" render={() => <PracticeContainer /> } />
          <Route path="/practice/:roomName" render={() => <PracticeContainer />}/>
          <Route exact path="/questions/:id" render={() => <Question /> } />
          <Route exact path="/questions" render={() => <Questions /> } />
          <Route exact path="/whiteboard" component= { InterviewBoardContainer } />

          {/* EMPLOYER ROUTES */}
          <Route exact path="/applications/employer" render={ () => <EmployerView type="in-progress"/> } />
        </Switch>
      </div>
    )
  }

  getApplicationsComponent () {
    return  this.props.employer?(<EmployerView type="in-progress"/>):(<UserInProgress type="in-progress"/>)
  }
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id,
    showAuth: state.auth.show,
    authView: state.auth.view,
    email: state.user.email,
    waiting: state.practice.waiting,
    room: state.practice.room,
    employer: state.user.employer
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
      dispatch(logout())
    },
    loadInitialData() {
      dispatch(me())
    },
    handleLogout(history) {
      dispatch(logout(history))
    }
  }
}

const mergeProps = (state, actions, ownProps) => ({
  ...state,
  ...actions,
  ...ownProps,
  handleLogout () {
    actions.handleLogout(ownProps.history)
  }
})

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch, mergeProps)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
