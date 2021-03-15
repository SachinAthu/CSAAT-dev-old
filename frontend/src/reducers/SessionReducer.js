import {
  FETCH_SESSIONS,
  ADD_SESSION,
  SET_ACTIVE_SESSION,
  UPDATE_SESSION,
  DELETE_SESSION,
  DELETE_SESSIONS,
  DELETE_ACTIVE_SESSION,
  UPDATE_ACTIVE_SESSION,
  SET_ACTIVE_SESSION_FIRST,
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
      const tempSessions = [...state.sessions];
      const updatedSession = action.data;

      tempSessions.forEach((s, i) => {
        if (s.id === updatedSession.id) {
          s.date = updatedSession.date;
          s.profile = updatedSession.profile;
          s.user = updatedSession.user;
        }
      });

      return {
        ...state,
        sessions: tempSessions,
      };

    case SET_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: action.data,
      };

    case SET_ACTIVE_SESSION_FIRST:
      return {
        ...state,
        activeSession: [...state.sessions][0],
      };

    case UPDATE_ACTIVE_SESSION:
      console.log(action.data);
      const tempSessions2 = [...state.sessions];
      const updatedSession2 = action.data;

      tempSessions2.forEach((s, i) => {
        if (s.id === updatedSession2.id) {
          s.date = updatedSession2.date;
        }
      });

      return {
        ...state,
        activeSession: action.data,
        sessions: tempSessions2,
      };

    case DELETE_SESSION:
      const ts = [...state.sessions]
      const fts = ts.filter(
        (session) => session.id !== action.data
      )
      
      let as = {}
      if(fts.length <= 0){
        as = {}
      }else{
        as = fts[0]
      }
      return {
        ...state,
        sessions: fts,
        activeSession: as
      };

    case DELETE_SESSIONS:
      return {
        ...state,
        sessions: [],
      };

    case DELETE_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: {},
      };

    default:
      return state;
  }
}
