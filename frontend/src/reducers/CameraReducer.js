import { FETCH_CAMERAS, ADD_CAMERA, DELETE_CAMERA, DELETE_CAMERAS } from "../actions/Types";

const initialState = {
  cameras: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CAMERAS:
      return {
        ...state,
        cameras: action.data,
      };

      case ADD_CAMERA:
        let c = [...state.cameras];
        c.unshift(action.data);
        return {
          ...state,
          cameras: c,
        };
  
      case DELETE_CAMERA:
        return {
          ...state,
          cameras: state.cameras.filter((camera) => camera.id !== action.data),
        };
  
      case DELETE_CAMERAS:
        return {
          ...state,
          cameras: [],
        };

    default:
      return state;
  }
}
