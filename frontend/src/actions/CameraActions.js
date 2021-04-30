import {FETCH_CAMERAS, ADD_CAMERA, DELETE_CAMERA, DELETE_CAMERAS} from './Types'

// get all cameras
export const getCameras = (cameras) => (dispatch, getState) => {
    dispatch({
        type: FETCH_CAMERAS,
        data: cameras
    })
}

// add a camera
export const addCamera = (camera) => (dispatch, getState) => {
    dispatch({
        type: ADD_CAMERA,
        data: camera
    })
}

// delete a camera
export const deleteCamera = (id) => (dispatch, getState) => {
    dispatch({
        type: DELETE_CAMERA,
        data: id
    })
}

// delete all cameras
export const deleteCameras = () => (dispatch, getState) => {
    dispatch({
        type: DELETE_CAMERAS,
    })
}


