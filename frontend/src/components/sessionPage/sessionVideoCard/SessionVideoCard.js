import React, { Component } from "react";

import classes from "./SessionVideoCard.module.css";
import AddVideo from "../../modals/addVideo/AddVideo";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import VideoPlayer from "../../videoPlayer/VideoPlayer";

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
    // console.log(res);
    this.setState({ deleting: false });
  };

  // convert seconds to HH:mm:ss format
  convertSec = (sec) => {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
    let MHSTime = measuredTime.toISOString().substr(11, 8);
    return MHSTime
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// event handlers ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // open the video add popup window
  addHandler = () => {
    this.setState({ adding: true });
  };

  // open the video add popup window for editting
  editHandler = (video) => {
    console.log(video);
    this.setState({ adding: true });
  };

  // open the delete alert
  deleteHandler = (video) => {
    // console.log(video)
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
            <VideoPlayer
              key={Math.random()}
              video={video}
            />
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
                onClick={this.editHandler.bind(this, video)}
                className={classes.editbtn}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Edit</title>
                  <path d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828q0.281-0.281 0.703-0.281t0.703 0.281l2.344 2.344q0.281 0.281 0.281 0.703t-0.281 0.703zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path>
                </svg>
              </button>

              <button
                onClick={this.deleteHandler.bind(this, video)}
                className={classes.removebtn}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Delete</title>
                  <path d="M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12q0 0.797-0.609 1.406t-1.406 0.609h-7.969q-0.797 0-1.406-0.609t-0.609-1.406z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      cardContent = (
        <div className={classes.empty}>
          <button onClick={this.addHandler}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <title>Add Video</title>
            <path d="M12 12l10 7-10 7v-14z"></path>
            <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
          </svg>
          </button>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        {cardContent}

        {adding ? (
          <AddVideo
            video={this.props.video}
            close={this.closeAddWindow}
          />
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
