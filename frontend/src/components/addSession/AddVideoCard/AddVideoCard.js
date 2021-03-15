import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./AddVideoCard.module.css";
import AddVideo from "./addVideo/AddVideo";
import DeleteConfirmPopup from "../../deleteConfirmPopup/DeleteConfirmPopup";
import Player from "../../player/Player";

import { deleteVideo } from "../../../actions/VideoActions";

class AddVideoCard extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    session: PropTypes.object,
    uploading: PropTypes.bool,
    deleteVideo: PropTypes.func.isRequired,
  };

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
  closeAddWindow = () => {
    this.setState({ adding: false });
  };

  closeDeleteConfirmPopup = (res) => {
    // console.log(res);
    this.setState({ deleting: false });
  };

  convertSec = (sec) => {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
    let MHSTime = measuredTime.toISOString().substr(11, 8);
    return MHSTime
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// event handlers ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  addHandler = () => {
    this.setState({ adding: true });
  };

  editHandler = (video) => {
    console.log(video);
    this.setState({ adding: true });
  };

  removeHandler = (video) => {
    // console.log(video)
    this.setState({ deleting: true });
  };

  render() {
    const { adding } = this.state;
    const { video } = this.props;

    let cardContent;
    if (video) {
      // this.getCameraAngle()
      cardContent = (
        <div className={classes.card_content}>
          <div className={classes.videoplay}>
            {/* <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="28"
              viewBox="0 0 24 28"
            >
              <title>Play</title>
              <path d="M12 2c6.625 0 12 5.375 12 12s-5.375 12-12 12-12-5.375-12-12 5.375-12 12-12zM18 14.859c0.313-0.172 0.5-0.5 0.5-0.859s-0.187-0.688-0.5-0.859l-8.5-5c-0.297-0.187-0.688-0.187-1-0.016-0.313 0.187-0.5 0.516-0.5 0.875v10c0 0.359 0.187 0.688 0.5 0.875 0.156 0.078 0.328 0.125 0.5 0.125s0.344-0.047 0.5-0.141z"></path>
            </svg> */}
            <Player
              key={Math.random()}
              video={video}
              width={270}
              height={190}
              fluid={false}
              autoplay={true}
              controls={false}
              muted={true}
              loop={true}
            />
          </div>

          <div className={classes.info}>
            <div className={classes.info_1}>
              <span className={classes.info_1_1}>
                Duration: {this.convertSec(video.duration)}
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
                onClick={this.removeHandler.bind(this, video)}
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
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Add Video</title>
              <path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
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
            card_id={this.props.card_id}
            video={this.props.video}
            close={this.closeAddWindow}
          />
        ) : null}

        {this.state.deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            many={false}
            header={"video"}
            msg={"Video file will also be deleted from database."}
            data={video ? video.id : null}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  session: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, { deleteVideo, withRef: true })(
  AddVideoCard
);
