/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Main} from './main'
export {default as UserHome} from './user-home'
export {default as Search} from './search/search'
export {default as Tile} from './tile/tile'
export {default as SearchBar} from './search-bar/search-bar'
export {default as Questions} from './questions/questions-container'
export {default as Question} from './questions/question'
export {Login, Signup} from './auth-form'
export {default as UserTile} from './tile-user/tile-user'
export {default as UserProfileForm} from './user-profile-form/user-profile-form'
export {default as UserProfileContainer} from './user-profile-form/user-profile-container'
export {default as UserProfile} from './user-profile-form/user-profile'

