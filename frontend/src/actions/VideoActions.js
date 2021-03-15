import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
  TOOGLE_PLAY_MODE,
  PLAY_ALL,
  PAUSE_ALL,
  STOP_ALL,
  SET_PERCENT,
  SET_TOTAL_TIME,
  SET_PERCENT_TIMELINE,
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

// update a video
export const updateVideo = (video) => (dispatch, getState) => {
  //console.log(video)
  dispatch({
    type: UPDATE_VIDEO,
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

// play all
export const playAll = () => (dispatch, getState) => {
  dispatch({
    type: PLAY_ALL,
  });
};

// pause all
export const pauseAll = () => (dispatch, getState) => {
  dispatch({
    type: PAUSE_ALL,
  });
};

// play all
export const stopAll = () => (dispatch, getState) => {
  dispatch({
    type: STOP_ALL,
  });
};

// set precentage of playing videos
export const setPercent = (percent, sec) => (dispatch, getState) => {
  dispatch({
    type: SET_PERCENT,
    data: {percent: percent, sec: sec},
  });
};

// set precentage from timeline
export const setPercentTimeline = (percent) => (dispatch, getState) => {
  dispatch({
    type: SET_PERCENT_TIMELINE,
    data: percent,
  });
};

// set total time of playing videos
export const setTotalTime = (time) => (dispatch, getState) => {
  dispatch({
    type: SET_TOTAL_TIME,
    data: time,
  });
};



