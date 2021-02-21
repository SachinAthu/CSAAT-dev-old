import {
  FETCH_PROFILES,
  ADD_PROFILE,
  SET_ACTIVE_PROFILE,
  UPDATE_PROFILE,
  DELETE_PROFILE,
} from "../actions/Types";

const initialState = {
  profiles: [],
  activeProfile: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_PROFILES:
      return {
        ...state,
        profiles: action.data,
      };

    case ADD_PROFILE:
      let p = [...state.profiles];
      p.unshift(action.data);
      return {
        ...state,
        profiles: p,
      };

    case SET_ACTIVE_PROFILE:
      return {
        ...state,
        activeProfile: action.data
      };

    case UPDATE_PROFILE:
      const tempProfiles = [...state.profiles]
      const updatedProfile = action.data

      tempProfiles.forEach((p, i) => {
        if(p.id === updatedProfile.id){
          p.clinic_no = updatedProfile.clinic_no
          p.name = updatedProfile.name
          p.dob = updatedProfile.dob
          p.sex = updatedProfile.sex
          p.consent_doc = updatedProfile.consent_doc
          p.consent_doc_name = updatedProfile.consent_doc_name
        }
      })

      return {
        ...state,
        profiles: tempProfiles
      }

    case DELETE_PROFILE:
      return {
        ...state,
        profiles: state.profiles.filter(
          (profile) => profile.id !== action.data
        ),
      };

    default:
      return state;
  }
}
