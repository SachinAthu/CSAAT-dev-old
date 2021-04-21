import React, { Fragment } from "react";

import classes from "./ModalFrame.module.css";

function ModalFrame(props) {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container} id="modalContent">
        <button onClick={() => props.close()} className={classes.closebtn}>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <title>Close</title>
            <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
          </svg>
        </button>

        {props.children}
      </div>

      <div className={classes.overlay} id="modalFrameOverlay"></div>
    </div>
  );
}

export default ModalFrame;
