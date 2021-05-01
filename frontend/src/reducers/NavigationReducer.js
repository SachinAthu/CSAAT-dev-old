import { SET_NAV } from '../actions/Types'


const initialState = {
    currentNav: null    
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_NAV:
            return{
                ...state,
                currentNav: action.data
            }
            break

        default:
            return state

    }

}

