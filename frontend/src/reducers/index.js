import { combineReducers } from "redux"
import ChildReducer from './ChildReducer'
import SessionReducer from './SessionReducer'
import VideoReducer from './VideoReducer'
import AudioReducer from './AudioReducer'
import NavigationReducer from './NavigationReducer'
import CameraReducer from './CameraReducer'
import CameraAngleReducer from './CameraAngleReducer'

export default combineReducers({
    childReducer: ChildReducer,
    sessionReducer: SessionReducer,
    videoReducer: VideoReducer,
    audioReducer: AudioReducer,
    navigationReducer: NavigationReducer,
    cameraReducer: CameraReducer,
    cameraAngleReducer: CameraAngleReducer,
})