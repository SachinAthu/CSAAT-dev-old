import React, { Component } from "react";

import classes from "./ModalFrame.module.css";

class ModalFrame extends Component {
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    if(this.props.player) {
      const container = document.getElementsByClassName(`${classes.container}`)[0]
      const closebtn_svg = document.getElementsByClassName(`${classes.closebtn_svg}`)[0]
      container.classList.add(`${classes.container_play}`)
      closebtn_svg.classList.add(`${classes.closebtn_play_svg}`)
    }
  }

  render() {
    return (
      <div className={classes.wrapper}>
        <div className={classes.container} id="modalContent">
          <button onClick={() => this.props.close()} className={classes.closebtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={classes.closebtn_svg}
            >
              <title>Close</title>
              <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
            </svg>
          </button>
  
          {this.props.children}
        </div>
  
        <div className={classes.overlay} id="modalFrameOverlay"></div>
      </div>
    );
  }
}

export default ModalFrame;
