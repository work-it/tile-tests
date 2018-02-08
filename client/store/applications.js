import axios from 'axios'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const APPLY = 'APPLY';
export const REVIEW = 'REVIEW';
const FETCH_APPLICTIONS = 'FETCH_APPLICATIONS';
const UPDATE_NOTES = 'UPDATE_NOTES';
const UPDATE_EMPLOYER_NOTES = 'UPDATE_EMPLOYER_NOTES';
export const ADD_MESSAGE = 'ADD_MESSAGE';
const ARCHIVE = 'ARCHIVE';
const FETCH_APP_W_PROFILE = 'FETCH_APP_W_PROFILE';
const OFFER = 'OFFER';
const OFFER_STATUS = 'OFFER_STATUS';

/**
 * INITIAL STATE
 */
const defaultApplications = [];
/**
 * ACTION CREATORS
 */
const apply = updateApplications => ({type: APPLY, updateApplications})
const review = updatedApplication => ({type: REVIEW, updatedApplication})
const offer = updatedApplication => ({type: OFFER, updatedApplication})
const offerStatus = updatedApplication => ({type: OFFER_STATUS, updatedApplication})
const fetchApplications = applications => ({type: FETCH_APPLICTIONS, applications})
const archive = updatedApplications => ({type: ARCHIVE, updatedApplications})
const updateNotes = updatedApplications => ({type: UPDATE_NOTES, updatedApplications})
const addMessage = updatedApplications => ({type: ADD_MESSAGE, updatedApplications})
const fetchAppsWithProfiles = applications => ({type: FETCH_APP_W_PROFILE, applications})
const updateEmployerNotes = updatedApplications => ({type: UPDATE_EMPLOYER_NOTES, updatedApplications})

/**
 * THUNK CREATORS
 */
export const offerLetterStatusThunk = (status) => {
  return (dispatch, getState) => {
    const application = getState().applications[0];
    const appId = application.id;
    application.offerStatus = status;
    if (status === 'accept') {
      application.status = 'hire';
    }
    const updatedApplication = [application];

    axios.put(`/api/applications/${appId}/offer-status`, {status})
    .then(res => {
      if (res.status === 200) {
        dispatch(offerStatus(updatedApplication));
      }
    })
  }
}

export const reviewApplicationThunk = () => {
  return (dispatch, getState) => {
    const application = getState().applications[0];
    const appId = application.id;
    application.status = 'review';
    const updatedApplication = [application];

    axios.put(`/api/applications/${appId}/review`)
    .then(res => {
      if (res.status === 200) {
        dispatch(review(updatedApplication));
      }
    })
  }
}

export const interviewApplicationThunk = () => {
  return (dispatch, getState) => {
    const application = getState().applications[0];
    const appId = application.id;
    application.status = 'interview';
    const updatedApplication = [application];

    axios.put(`/api/applications/${appId}/interview`)
    .then(res => {
      if (res.status === 200) {
        dispatch(review(updatedApplication));
      }
    })
  }
}

export const sendOfferThunk = (offerLetter) => {
  return (dispatch, getState) => {
    const application = getState().applications[0];
    const appId = application.id;
    application.status = 'offer';
    application.offer = offerLetter;
    const updatedApplication = [application];

    axios.put(`/api/applications/${appId}/offer`, {offerLetter})
    .then(res => {
      if (res.status === 200) {
        dispatch(offer(updatedApplication));
      }
    })
  }
}

export const fetchAppsWithProfilesThunk = (employerId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/applications/employer/${employerId}`)
    .then(res => {
      dispatch(fetchAppsWithProfiles(res.data));
    })
  }
}

export const fetchApplicationsThunk = (userId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/applications/${userId}`)
    .then(res => {
      dispatch(fetchApplications(res.data));
    })
  }
}


export const applyThunk = (id, coverLetter, employerId) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;

    // Create a new application object.
    const newApplication = {
      jobId: id,
      status: 'apply',
      archived: false,
      employerNotes: '',
      applicantNotes: '',
      chat: '',
      coverLetter: coverLetter,
      offerLetter: ''
    }
    // Create a copy of the current application store and add in the new application.
    const allApplications = [...getState().applications, newApplication];

    // Post request to server to add application to Firebase
    axios.post('/api/applications/', {application: newApplication, userId, employerId})
    .then(res => {
      if (res.status === 200) {
        // Call action creator to update the redux store on successful post.
        dispatch(apply(allApplications))
      }
    })
  }
}

export const updateNotesMiddleware = (applicationId, notes) => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.applicantNotes = notes;
      }
      return application;
    })

   axios.put(`/api/applications/${applicationId}/notes`, {notes})
    .then(() =>  dispatch(updateNotes(updatedApplications)));
  }
}

export const updateEmployerNotesMiddleware = (applicationId, notes) => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.employerNotes = notes;
      }
      return application;
    })

   axios.put(`/api/applications/${applicationId}/employer/notes`, {notes})
    .then(() =>  dispatch(updateEmployerNotes(updatedApplications)));
  }
}

export const archiveMiddleware = applicationId => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.archived = true;
      }
      return application;
    })

    axios.put(`/api/applications/${applicationId}/archive`)
    .then(() => dispatch(archive(updatedApplications)));
  }
}

export const addMessageMiddleware = (applicationId, message) => {
  return (dispatch, getState) => {
    let updatedMessage;
    let name = getState().user.name;
    let updatedApplications = [...getState().applications].filter(application => application).map(application => {
      if (application.id === applicationId) {
        application.chat += `<strong>${name}: </strong> ${message}<br/>`;
        updatedMessage = application.chat;
      }
      return application;
    })

    axios.put(`/api/applications/${applicationId}/message`, {message: updatedMessage})
    .then(() => dispatch(addMessage(updatedApplications)));
  }
}


/**
 * REDUCER
 */
export default function (state = defaultApplications, action) {
  switch (action.type) {
    case OFFER_STATUS:
      return action.updatedApplication
    case OFFER:
      return action.updatedApplication
    case REVIEW:
      return action.updatedApplication
    case ADD_MESSAGE:
      return action.updatedApplications
    case ARCHIVE:
      return action.updatedApplications
    case UPDATE_NOTES:
      return action.updatedApplications
    case UPDATE_EMPLOYER_NOTES:
      return action.updatedApplications
    case APPLY:
      return action.updateApplications
    case FETCH_APPLICTIONS:
      return action.applications
    case FETCH_APP_W_PROFILE:
      return action.applications
    default:
      return state
  }
}
