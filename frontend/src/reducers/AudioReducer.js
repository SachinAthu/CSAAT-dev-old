import { FETCH_AUDIO, ADD_AUDIO, DELETE_AUDIO } from '../actions/Types'

const initialState = {
    audio: null,
};

export default function (state = initialState, action) {
    switch(action.type){
        case FETCH_AUDIO:
        case ADD_AUDIO:
            return {
                ...state,
                audio: action.data,
            }

        case DELETE_AUDIO:
            return{
                ...state,
                audio: null
            }
        
        default:
            return state
    }


}