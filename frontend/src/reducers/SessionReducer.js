import {
  FETCH_SESSIONS,
  ADD_SESSION,
  UPDATE_SESSION,
  DELETE_SESSION,
  DELETE_SESSIONS,
  SET_ACTIVE_SESSION,
  SET_ACTIVE_SESSION_FIRST,
  UPDATE_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
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
      var s = [...state.sessions];
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

    case DELETE_SESSION:
      const ts = [...state.sessions];

      return {
        ...state,
        sessions: ts.filter((session) => session.id != action.data),
      };

    case DELETE_SESSIONS:
      return {
        ...state,
        sessions: [],
      };

    case SET_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: action.data,
      };

    case SET_ACTIVE_SESSION_FIRST:
      var s = [...state.sessions];
      localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION, s[0].id)

      return {
        ...state,
        activeSession: s[0]
      };

    case UPDATE_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: action.data,
      };

    default:
      return state;
  }
}
