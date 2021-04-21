import React, { Component } from "react";

import classes from "./AudioPlayer.module.css";
import ModalFrame from "../modalFrame/ModalFrame";

class AudioPlayer extends Component {
  render() {
    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container}>
            <div className={classes.pic}>
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                >
                    <path d="M30 0h2v23c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-11.501l-16 3.556v15.444c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-19.501l18-4z"></path>
                </svg>
            </div>

          <audio controls>
            <source
              src={"http://localhost:8000" + this.props.audio.audio}
              type={this.props.audio.file_type}
            ></source>
            <p>Your browser does not support this audio type.</p>
          </audio>
        </div>
      </ModalFrame>
    );
  }
}

export default AudioPlayer;
