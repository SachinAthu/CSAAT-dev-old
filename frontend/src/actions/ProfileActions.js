import {FETCH_PROFILES, ADD_PROFILE, SET_ACTIVE_PROFILE, UPDATE_PROFILE, DELETE_PROFILE} from './Types'

// get all profiles
export const getProfiles = (profiles) => (dispatch, getState) => {
    dispatch({
        type: FETCH_PROFILES,
        data: profiles
    })
}

// add a profile
export const addProfile = (profile) => (dispatch, getState) => {
    // console.log(profile)
    dispatch({
        type: ADD_PROFILE,
        data: profile
    })
}

// set active profile
export const setActiveProfile = (profile) => (dispatch, getState) => {
    // console.log(profile)
    dispatch({
        type: SET_ACTIVE_PROFILE,
        data: profile
    })
}

// update a profile
export const updateProfile = (profile) => (dispatch, getState) => {
    dispatch({
        type: UPDATE_PROFILE,
        data: profile
    })
}

// delete a profile
export const deleteProfile = (id) => (dispatch, getState) => {
    dispatch({
        type: DELETE_PROFILE,
        data: id
    })
} 