import {
    FETCH_SESSIONS,
    ADD_SESSION,
    SET_ACTIVE_SESSION,
    UPDATE_SESSION,
    DELETE_SESSION,
  } from "../actions/Types";
  
  const initialState = {
    sessions: [],
    activeSession: {},
  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case FETCH_SESSIONS:
        return {
          ...state,
          sessions: action.data,
        };
  
      case ADD_SESSION:
        let s = [...state.sessions];
        s.unshift(action.data);
        return {
          ...state,
          sessions: s,
        };

      case UPDATE_SESSION:
        const tempSessions = [...state.sessions]
        const updatedSession = action.data

        tempSessions.forEach((s, i) => {
          if(s.id === updatedSession.id){
            s.datetime = updatedSession.datetime
            s.profile = updatedSession.profile
            s.user = updatedSession.user
          }
        })

        return {
          ...state,
          sessions: tempSessions
        }
  
      case SET_ACTIVE_SESSION:
        return {
          ...state,
          activeSession: action.data
        };
  
      case DELETE_SESSION:
        return {
          ...state,
          sessions: state.sessions.filter(
            (session) => session.id !== action.data
          ),
        };
  
      default:
        return state;
    }
  }
  