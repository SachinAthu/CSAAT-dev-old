import React, { Component } from "react";

import classes from "./SessionVideoCard.module.css";
import AddVideo from "../../modals/addVideo/AddVideo";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import VideoPlayer from "../../videoPlayer/VideoPlayer";
import ErrorBoundry from '../../ErrorBoundry'

class SessionVideoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      deleting: false,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// functions ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // close video add popup window
  closeAddWindow = () => {
    this.setState({ adding: false });
  };

  // close video delete confirmation alert box
  closeDeleteConfirmPopup = (res) => {
    this.setState({ deleting: false });
  };

  // convert seconds to HH:mm:ss format
  convertSec = (sec) => {
    try{
      let measuredTime = new Date(null);
      measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    }catch(err){
      return '00:00:00'
    }
  };

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// event handlers ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // open the video add popup window
  addHandler = () => {
    this.setState({ adding: true });
  };

  // open the delete alert
  deleteHandler = (video) => {
    this.setState({ deleting: true });
  };

  render() {
    const { adding, deleting } = this.state;
    const { video } = this.props;

    let cardContent;
    if (video) {
      // this.getCameraAngle()
      cardContent = (
        <div className={classes.card_content}>
          <div className={classes.videoplay}>
            <VideoPlayer key={Math.random()} video={video} />
          </div>

          <div className={classes.info}>
            <div className={classes.info_1}>
              <span className={classes.info_1_1}>
                Duration: {video.duration ? this.convertSec(video.duration) : 0}
              </span>
              <span className={classes.info_1_2}>
                Camera: {video.camera_name}
              </span>
              <span className={classes.info_1_2}>
                Camera angle: {video.camera_angle_name}
              </span>
            </div>

            <div className={classes.info_2}>
              <button
                onClick={this.deleteHandler.bind(this, video)}
                className={classes.removebtn}
              >
               Delete
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      cardContent = (
        <div className={classes.empty}>
          <button onClick={this.addHandler}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Add Video</title>
              <path d="M8.016 13.031l3.984-4.031 3.984 4.031-1.406 1.406-1.594-1.594v4.172h-1.969v-4.172l-1.594 1.594zM20.016 18v-9.984h-16.031v9.984h16.031zM20.016 6q0.797 0 1.383 0.609t0.586 1.406v9.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h6l2.016 2.016h8.016z"></path>
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        {cardContent}

        {adding ? (
          <ErrorBoundry>
            <AddVideo close={this.closeAddWindow} />
          </ErrorBoundry>
        ) : null}

        {deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            many={false}
            type="video"
            header={"video"}
            data={video ? video.id : null}
          />
        ) : null}
      </div>
    );
  }
}

export default SessionVideoCard;
