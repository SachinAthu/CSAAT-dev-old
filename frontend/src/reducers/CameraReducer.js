import { FETCH_CAMERAS, FETCH_CAMERA_ANGLES } from "../actions/Types";

const initialState = {
  cameras: [],
  camera_angles: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CAMERAS:
      return {
        ...state,
        cameras: action.data,
      };

    case FETCH_CAMERA_ANGLES:
      return {
        ...state,
        camera_angles: action.data,
      };

    default:
      return state;
  }
}
