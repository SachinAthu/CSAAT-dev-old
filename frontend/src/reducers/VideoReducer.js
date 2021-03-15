import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
  PLAY_MODES,
  PLAY_STATUS,
  TOOGLE_PLAY_MODE,
  PLAY_ALL,
  PAUSE_ALL,
  STOP_ALL,
  SET_PERCENT,
  SET_TOTAL_TIME,
  SET_PERCENT_TIMELINE,
} from "../actions/Types";

const initialState = {
  videos: [],
  playMode: PLAY_MODES.ALL,
  playState: PLAY_STATUS.PAUSE,
  percent: 0,
  currentTime: 0,
  currentTime2: 0,

  totalTime: 0,
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
      var m = state.playMode;
      var r = "";
      var s = state.playState;

      if (action.data) {
        r = action.data;
        if (action.data === PLAY_MODES.ALL) {
          s = PLAY_STATUS.STOP;
        }
      } else {
        if (m === PLAY_MODES.ALL) {
          r = PLAY_MODES.SINGLE;
        } else {
          r = PLAY_MODES.ALL;
        }
      }
      return {
        ...state,
        playMode: r,
        playState: s,
      };

    case PLAY_ALL:
      var m = state.playMode;
      if (m === PLAY_MODES.SINGLE) {
        m = PLAY_MODES.ALL;
      }
      return {
        ...state,
        playMode: m,
        playState: PLAY_STATUS.PLAY,
      };

    case PAUSE_ALL:
      return {
        ...state,
        playState: PLAY_STATUS.PAUSE,
      };

    case STOP_ALL:
      return {
        ...state,
        playState: PLAY_STATUS.STOP,
      };

    case SET_PERCENT:
      // var tv = [...state.videos];
      // var st = action.data;
      
      // find total time of all videos
      // var totalT = 0
      // tv.forEach((v, i) => {
      //  totalT += parseInt(v.duration)
      // });

      // var percent = totalP / tv.length
      // console.log(percent)

      if(action.data.percent >= 100){
        return {
          ...state,
          percent: action.data.percent,
          currentTime: action.data.sec,
          playState: PLAY_STATUS.STOP,
        };
      }
      return {
        ...state,
        percent: action.data.percent,
        currentTime: action.data.sec,
      };

    case SET_PERCENT_TIMELINE:
      var ct = Math.round((state.totalTime * action.data) / 100) 
      console.log(ct)
      return{
        ...state,
        currentTime2: ct,
        percent: action.data,
      }

    case SET_TOTAL_TIME:
      return {
        ...state,
        totalTime: action.data,
      };

    default:
      return state;
  }
}
