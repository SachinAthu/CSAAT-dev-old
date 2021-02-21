import {
  FETCH_VIDEOS,
  ADD_VIDEO,
  UPDATE_VIDEO,
  DELETE_VIDEO,
  DELETE_VIDEOS,
} from "../actions/Types";

const initialState = {
  videos: [],
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
      const tempVideos = [...state.videos]
      const updatedVideo = action.data

      tempVideos.forEach((v, i) => {
        console.log(v.id, updatedVideo.id)
        if(v.id === updatedVideo.id){
          
          v.profile = updatedVideo.profile
          v.session = updatedVideo.session
          v.camera = updatedVideo.camera
          v.name = updatedVideo.name
          v.description = updatedVideo.description
          v.video = updatedVideo.video
          v.type = updatedVideo.video.type
          v.camera_angle = updatedVideo.camera_angle
          v.duration = updatedVideo.duration
        }
      })

      console.log(tempVideos)

      return {
        ...state,
        videos: tempVideos
      }


    case DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter((video) => video.id !== action.data.id),
      };

    case DELETE_VIDEOS:
      return {
        ...state,
        videos: [],
      };

    default:
      return state;
  }
}
