import {
    FETCH_SESSIONS,
    ADD_SESSION,
    UPDATE_SESSION,
    DELETE_SESSION,
    DELETE_SESSIONS,
    SET_ACTIVE_SESSION,
    SET_ACTIVE_SESSION_FIRST,
    UPDATE_ACTIVE_SESSION,
  } from "./Types";
  
  // get all sessions for a profile
export const getSessions = (sessions) => (dispatch, getState) => {
    dispatch({
        type: FETCH_SESSIONS,
        data: sessions
    })
}

// add a session
export const addSession = (session) => (dispatch, getState) => {
    // console.log(session)
    dispatch({
        type: ADD_SESSION,
        data: session
    })
}

// update session
export const updateSession = (session) => (dispatch, getState) => {
    console.log(session)
    dispatch({
        type: UPDATE_SESSION,
        data: session
    })
}

// delete a session
export const deleteSession = (id) => (dispatch, getState) => {
    dispatch({
        type: DELETE_SESSION,
        data: id
    })
} 

// delete sessions
export const deleteSessions = () => (dispatch, getState) => {
    dispatch({
        type: DELETE_SESSIONS,
    })
}

// set active session
export const setActiveSession = (session) => (dispatch, getState) => {
    dispatch({
        type: SET_ACTIVE_SESSION,
        data: session
    })
} 

// set the first session as the active session
export const setActiveSessionFirst = () => (dispatch, getState) => {
    dispatch({
        type: SET_ACTIVE_SESSION_FIRST,
    })
}

// update active session
export const updateActiveSession = (session) => (dispatch, getState) => {
    dispatch({
        type: UPDATE_ACTIVE_SESSION,
        data: session
    })
} 


