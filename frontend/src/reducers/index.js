import { combineReducers } from "redux"
import ProfileReducer from './ProfileReducer'
import SessionReducer from './SessionReducer'
import VideoReducer from './VideoReducer'
import CameraReducer from './CameraReducer'

export default combineReducers({
    profileReducer: ProfileReducer,
    sessionReducer: SessionReducer,
    videoReducer: VideoReducer,
    cameraReducer: CameraReducer,
})