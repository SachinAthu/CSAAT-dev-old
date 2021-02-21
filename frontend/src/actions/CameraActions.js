import {FETCH_CAMERAS, FETCH_CAMERA_ANGLES} from './Types'

// get all cameras
export const getCameras = (cameras) => (dispatch, getState) => {
    dispatch({
        type: FETCH_CAMERAS,
        data: cameras
    })
}

// get all camera angles
export const getCameraAngles = (camera_angles) => (dispatch, getState) => {
    dispatch({
        type: FETCH_CAMERA_ANGLES,
        data: camera_angles
    })
}
