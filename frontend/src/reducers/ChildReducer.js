import {
  FETCH_CHILDREN,
  ADD_CHILD,
  UPDATE_CHILD,
  DELETE_CHILD,
  SET_ACTIVE_CHILD,
  SET_ACTIVE_CHILD_TYPE,
  CHILD_TYPES,
} from "../actions/Types";

const initialState = {
  children: [],
  activeChild: {},
  childType: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CHILDREN:
      return {
        ...state,
        children: action.data,
      };

    case ADD_CHILD:
      let c = [...state.children];
      c.unshift(action.data);
      return {
        ...state,
        children: c,
      };

    case UPDATE_CHILD:
      const tempChildren = [...state.children];
      const updatedChild = action.data;

      console.log(action.data)

      tempChildren.forEach((c, i) => {
        if (c.id === updatedChild.id) {
          if (state.childType === CHILD_TYPES.TYPICAL) {
            c.unique_no = updatedChild.unique_no;
            c.sequence_no = updatedChild.sequence_no;
          } else {
            c.clinic_no = updatedChild.clinic_no;
          }
          c.name = updatedChild.name;
          c.dob = updatedChild.dob;
          c.gender = updatedChild.gender;
          c.cdoc = updatedChild.cdoc;
          c.cdoc_name = updatedChild.cdoc_name;
          c.dgform = updatedChild.dgform;
          c.dgform_name = updatedChild.dgform_name;
        }
      });

      console.log(tempChildren)

      return {
        ...state,
        children: tempChildren,
      };

    case DELETE_CHILD:
      return {
        ...state,
        children: state.children.filter((child) => child.id !== action.data),
      };

    case SET_ACTIVE_CHILD:
      return {
        ...state,
        activeChild: action.data,
      };

    case SET_ACTIVE_CHILD_TYPE:
      return {
        ...state,
        childType: action.data,
      };

    default:
      return state;
  }
}
