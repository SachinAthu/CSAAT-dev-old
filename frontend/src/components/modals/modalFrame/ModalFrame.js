import React, { Fragment } from "react";

import classes from "./ModalFrame.module.css";

function ModalFrame(props) {
  const closeModal = () => {
    const modal = document.getElementById("modalContent");
    const overlay = document.getElementById("modalFrameOverlay");

    modal.classList.add(`${classes.fadeout}`);
    overlay.classList.add(`${classes.overlay_fadeout}`);

    setTimeout(() => {
      props.close();
    }, 300);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.container} id="modalContent">
        <button onClick={() => closeModal()} className={classes.closebtn}>
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
