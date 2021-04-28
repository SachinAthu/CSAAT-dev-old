import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
  TOOGLE_PLAY_MODE,
  TOOGLE_PLAY_STATE,
} from "./Types";

// get all videos for a session
export const getVideos = (videos) => (dispatch, getState) => {
  dispatch({
    type: FETCH_VIDEOS,
    data: videos,
  });
};

// add a video
export const addVideo = (video) => (dispatch, getState) => {
  // console.log(video)
  dispatch({
    type: ADD_VIDEO,
    data: video,
  });
};

// delete a video
export const deleteVideo = (id) => (dispatch, getState) => {
  dispatch({
    type: DELETE_VIDEO,
    data: id,
  });
};

// delete all videos
export const deleteVideos = () => (dispatch, getState) => {
  dispatch({
    type: DELETE_VIDEOS,
  });
};


////////////////// video play controls //////////////////////////////
// toogle play mode
export const tooglePlayMode = (mode) => (dispatch, getState) => {
  dispatch({
    type: TOOGLE_PLAY_MODE,
    data: mode,
  });
};

// toogle play state
export const tooglePlayState = (state) => (dispatch, getState) => {
  dispatch({
    type: TOOGLE_PLAY_STATE,
    data: state,
  });
};




