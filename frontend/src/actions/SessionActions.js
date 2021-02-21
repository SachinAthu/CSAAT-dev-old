import {
    FETCH_SESSIONS,
    ADD_SESSION,
    SET_ACTIVE_SESSION,
    UPDATE_SESSION,
    DELETE_SESSION,
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

// set active session
export const setActiveSession = (session) => (dispatch, getState) => {
    // console.log(session)
    dispatch({
        type: SET_ACTIVE_SESSION,
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

