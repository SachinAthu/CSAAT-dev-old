import {
  FETCH_CHILDREN,
  ADD_CHILD,
  UPDATE_CHILD,
  DELETE_CHILD,
  CHILD_TYPES,
  DELETE_CHILDREN,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
} from "../actions/Types";

const initialState = {
  children: [],
};

function isDuplicate(arr, c) {
  for(let i = 0; i < arr.length; i++) {
    if(c.id === arr[i].id){
      return true
    }
  }
  return false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_CHILDREN:
      var children = [...state.children];
      
      if (children.length > 0) {
        const d = [...action.data];
        for (let i = 0; i < d.length; i++) {
          if(!isDuplicate(children, d[i])){
            children.push(d[i]);
          }
        }
      } else {
        children = action.data;
      }

      return {
        ...state,
        children: children,
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

      console.log(action.data);

      tempChildren.forEach((c, i) => {
        if (c.id === updatedChild.id) {
          if (localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE) === CHILD_TYPES.TYPICAL) {
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

      console.log(tempChildren);

      return {
        ...state,
        children: tempChildren,
      };

    case DELETE_CHILD:
      return {
        ...state,
        children: state.children.filter((child) => child.id !== action.data),
      };

    case DELETE_CHILDREN:
      return {
        ...state,
        children: [],
      };

    default:
      return state;
  }
}
