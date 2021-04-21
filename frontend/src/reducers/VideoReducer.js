import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
  PLAY_MODES,
  TOOGLE_PLAY_MODE,
  TOOGLE_PLAY_STATE,
  PLAY_STATUS,
} from "../actions/Types";

const initialState = {
  videos: [],
  playMode: PLAY_MODES.SINGLE,
  playState: PLAY_STATUS.STOP,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_VIDEOS:
      return {
        ...state,
        videos: action.data,
      };

    case ADD_VIDEO:
      let v = [...state.videos];
      v.push(action.data);
      return {
        ...state,
        videos: v,
      };

    case UPDATE_VIDEO:
      const tempVideos = [...state.videos];
      const updatedVideo = action.data;

      tempVideos.forEach((v, i) => {
        if (v.id === updatedVideo.id) {
          v = updatedVideo;
        }
      });
      return {
        ...state,
        videos: tempVideos,
      };

    case DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.data),
      };

    case DELETE_VIDEOS:
      return {
        ...state,
        videos: [],
      };

    case TOOGLE_PLAY_MODE:
      return {
        ...state,
        playMode: action.data,
      };

      case TOOGLE_PLAY_STATE:
        return {
          ...state,
          playState: action.data,
        };

    default:
      return state;
  }
}
