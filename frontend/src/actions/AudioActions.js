import { FETCH_AUDIO, ADD_AUDIO, DELETE_AUDIO } from "./Types";

// get all audio for a session
export const getAudio = (audio) => (dispatch, getState) => {
  dispatch({
    type: FETCH_AUDIO,
    data: audio,
  });
};

// add a audio
export const addAudio = (audio) => (dispatch, getState) => {
  // console.log(audio)
  dispatch({
    type: ADD_AUDIO,
    data: audio,
  });
};

// delete a audio
export const deleteAudio = (id) => (dispatch, getState) => {
  dispatch({
    type: DELETE_AUDIO,
    data: id,
  });
};
