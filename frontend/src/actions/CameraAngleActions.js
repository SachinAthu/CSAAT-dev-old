import { FETCH_CAMERA_ANGLES, ADD_CAMERA_ANGLE, DELETE_CAMERA_ANGLE, DELETE_CAMERA_ANGLES } from './Types'

// get all camera angles
export const getCameraAngles = (camera_angles) => (dispatch, getState) => {
    dispatch({
        type: FETCH_CAMERA_ANGLES,
        data: camera_angles
    })
}

// add a camera angle
export const addCameraAngle = (camera_angle) => (dispatch, getState) => {
    dispatch({
        type: ADD_CAMERA_ANGLE,
        data: camera_angle
    })
}

// delete a camera angle
export const deleteCameraAngle = (id) => (dispatch, getState) => {
    dispatch({
        type: DELETE_CAMERA_ANGLE,
        data: id
    })
}

// delete all camera angles
export const deleteCameraAngles = () => (dispatch, getState) => {
    dispatch({
        type: DELETE_CAMERA_ANGLES,
    })
}
