import {
  FETCH_CHILDREN,
  ADD_CHILD,
  UPDATE_CHILD,
  DELETE_CHILD,
  DELETE_CHILDREN,
} from "./Types";

// get all Children
export const getChildren = (children) => (dispatch, getState) => {
  dispatch({
    type: FETCH_CHILDREN,
    data: children,
  });
};

// add a Child
export const addChild = (child) => (dispatch, getState) => {
  // console.log(child)
  dispatch({
    type: ADD_CHILD,
    data: child,
  });
};


// update a Child
export const updateChild = (child) => (dispatch, getState) => {
    dispatch({
        type: UPDATE_CHILD,
        data: child,
    });
};

// delete a Child
export const deleteChild = (id) => (dispatch, getState) => {
    dispatch({
        type: DELETE_CHILD,
        data: id,
    });
};

// delete all Children
export const deleteChildren = () => (dispatch, getState) => {
  dispatch({
      type: DELETE_CHILDREN,
  });
};
