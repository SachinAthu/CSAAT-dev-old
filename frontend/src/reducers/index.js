import { combineReducers } from "redux"
import ChildReducer from './ChildReducer'
import SessionReducer from './SessionReducer'
import VideoReducer from './VideoReducer'
import AudioReducer from './AudioReducer'
import CameraReducer from './CameraReducer'

export default combineReducers({
    childReducer: ChildReducer,
    sessionReducer: SessionReducer,
    videoReducer: VideoReducer,
    cameraReducer: CameraReducer,
    audioReducer: AudioReducer,
})