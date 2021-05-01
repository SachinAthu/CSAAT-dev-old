import { SET_NAV } from './Types'

// set the navigation link in the sidenav
export const setNav = (nav) => (dispatch, getState) => {
    dispatch({
      type: SET_NAV,
      data: nav,
    });
  };