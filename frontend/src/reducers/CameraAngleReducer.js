import { FETCH_CAMERA_ANGLES, ADD_CAMERA_ANGLE, DELETE_CAMERA_ANGLE, DELETE_CAMERA_ANGLES } from "../actions/Types";

const initialState = {
  cameraAngles: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CAMERA_ANGLES:
      return {
        ...state,
        cameraAngles: action.data,
      };

      case ADD_CAMERA_ANGLE:
        let ca = [...state.cameraAngles];
        ca.unshift(action.data);
        return {
          ...state,
          cameraAngles: ca,
        };
  
      case DELETE_CAMERA_ANGLE:
        return {
          ...state,
          cameraAngles: state.cameraAngles.filter((camera_angle) => camera_angle.id !== action.data),
        };
  
      case DELETE_CAMERA_ANGLES:
        return {
          ...state,
          cameraAngles: [],
        };

    default:
      return state;
  }
}
