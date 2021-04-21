import {
  FETCH_CHILDREN,
  ADD_CHILD,
  UPDATE_CHILD,
  DELETE_CHILD,
  SET_ACTIVE_CHILD,
  SET_ACTIVE_CHILD_TYPE,
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

// set active child
export const setActiveChild = (child) => (dispatch, getState) => {
  // console.log(child)
  dispatch({
    type: SET_ACTIVE_CHILD,
    data: child,
  });
};

// set active child type
export const setActiveChildType = (type) => (dispatch, getState) => {
    // console.log(type)
    dispatch({
      type: SET_ACTIVE_CHILD_TYPE,
      data: type,
    });
  };