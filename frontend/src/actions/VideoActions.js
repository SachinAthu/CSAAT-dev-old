import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
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
export const deleteVideo = (video) => (dispatch, getState) => {
  dispatch({
    type: DELETE_VIDEO,
    data: video,
  });
};

// delete all videos
export const deleteVideos = () => (dispatch, getState) => {
  dispatch({
    type: DELETE_VIDEOS,
  });
};


