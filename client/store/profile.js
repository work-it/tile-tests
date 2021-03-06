import axios from 'axios'
import history from '../history'
import concat from "concat-stream"
/**
 * ACTION TYPES
 */
const UPDATE_PROFILE = 'UPDATE_PROFILE'
const GET_PROFILE = 'GET_PROFILE'
export const UPLOAD_VIDEO = 'UPLOAD_VIDEO'
export const VIDEO_UPLOADED = 'VIDEO_UPLOADED'
export const START_FILE_UPLOAD = 'START_FILE_UPLOAD'
const GOT_ALL_USERS = 'GOT_ALL_USERS'
const UPDATE_STEP = 'UPDATE_STEP'

/**
 * INITIAL STATE
 */
const defaultProfile = {}

/**
 * ACTION CREATORS
 */
export const updateStep = (step)  => ({
  type: UPDATE_STEP, step
})
const updateProfile = data => ({type: UPDATE_PROFILE, data})
const gotAllUsers = allUsers => ({type: GOT_ALL_USERS, allUsers})
const getProfile = data => ({type: GET_PROFILE, data})
export const uploadVideo = info => ({
  type: UPLOAD_VIDEO,
  info
})

export const loadAllUsers = () => dispatch => {
  axios.get('/api/profiles')
  .then(res => res.data)
  .then(res => dispatch (gotAllUsers(res)))
  .catch (console.log)
}

export const videoUploaded = name => ({
  type: VIDEO_UPLOADED,
  name
})

/**
 * THUNK CREATORS
 */
export const getProfileThunk = (userId) => {
  return (dispatch, getState) => {
    if (!userId) {
      userId = getState().user.id;
    }

    axios.get(`/api/profiles/${userId}`)
      .then(res => {
        console.log('data', res.data)
        if (res.data && !res.data.userId)
          res.data.userId = userId
        dispatch(getProfile(res.data));
      })
  }
}

const startFileUpload = (info,file, reader) => ({
  type: START_FILE_UPLOAD,
  info, file, reader
})

export const saveProfileVideo = (name, file) => (dispatch, getState) => {

  //console.log("got video to upload", name);
 // name=name.
 if(!file.name) file.name = 'videoProfile.webm'
  name = getState().user.id+file.name

  const reader = new FileReader();
   reader.onload = evnt => dispatch(uploadVideo( { name, data : evnt.target.result }))
   dispatch (startFileUpload({name, size:file.size}, file, reader))
}

export const saveProfilePhoto = (name, file) => (dispatch, getState) => {
  console.log("got image and file", name, file)
  const id = getState().user.id
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name)
     axios.put(`/api/profiles/upload/photo/${id}`, formData)
     .then (res => res.data)
     .then (res => dispatch(updateProfile({imgUrl: res.imgUrl})))

}

export const pushVideoToFirebase = name => (dispatch, getState) => {
  const id = getState().user.id
  axios.put(`/api/profiles/upload/video/${id}`, {name})
     .then (res => res.data)
     .then (res => dispatch(updateProfile({videoUrl: res.videoUrl})))

}




// DONT MODIFY, IT SHOULD WORK WITH WHATEVER IS PASSED IN!
export const updateProfileThunk = (data) => {
  return (dispatch, getState) => {
    // Get user from the current redux store
    const userId = getState().user.id;
    const profile = Object.assign({}, getState().profile, data);
    if (!profile.userId){
      profile.userId = userId
    }

    // Get profile for the current logged in user
    axios.put(`/api/profiles/${userId}`, profile)
      .then(res => {
       if (res.status === 200) {

        // Dispatch action creator to update the local redux store
        dispatch(updateProfile(profile));
       }
      })
  }
}
/**
 * REDUCER
 */
export default function (state = defaultProfile, action) {
  switch (action.type) {
    case UPDATE_PROFILE:
      // Create a copy of the current profiles store state and update key/value pairs
      return Object.assign({}, state, action.data);
    case GET_PROFILE:
      // Replace the current profile store state with the profile retrieved from Firebase
      return action.data?action.data : {}
    case GOT_ALL_USERS:
      return Object.assign({}, state, {allProfiles:action.allUsers})
    case UPDATE_STEP:
      return Object.assign({}, state, {step:action.step})
    default:
      return state
  }
}
