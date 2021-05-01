import React, { Fragment } from "react";

import classes from './PageSpinner.module.css'

const PageSpinner = (props) => {
  return (
    <Fragment>
      <div className={classes.lds_default}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Fragment>
  );
};

export default PageSpinner;
