import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./VideoPlayer.module.css";
import SingleVideoPlayerModal from "../modals/singleVideoPlayerModal/SingleVideoPlayerModal";

import { PLAY_MODES, PLAY_STATUS } from "../../actions/Types";

class VideoPlayer extends Component {
  static propTypes = {
    playState: PropTypes.string,
    playMode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  // open the video play modal
  onClickHandler = () => {
    this.setState({ modal: true });
  };

  closeModalWindow = () => {
    this.setState({ modal: false });
  };

  // play video on mouse hover
  onMouseEnterHandler = () => {
    if (
      this.props.playMode === PLAY_MODES.SINGLE &&
      this.props.playState === PLAY_STATUS.STOP
    ) {
      var video = document.getElementById(
        this.props.video.id + this.props.video.name
      );
      video.play();
    }
  };

  // stop video on mouse leave
  onMouseLeaveHandler = () => {
    if (
      this.props.playMode === PLAY_MODES.SINGLE &&
      this.props.playState === PLAY_STATUS.STOP
    ) {
      var video = document.getElementById(
        this.props.video.id + this.props.video.name
      );
      video.pause();
      video.currentTime = 0;
    }
  };

  render() {
    return (
      <div className={classes.container}>
        <div data-vjs-player>
          <video
            id={this.props.video.id + this.props.video.name}
            className={`${classes.player}`}
            onClick={this.onClickHandler}
            onMouseEnter={this.onMouseEnterHandler}
            onMouseLeave={this.onMouseLeaveHandler}
            autoPlay={false}
            controls={false}
            muted={true}
            src={"http://localhost:8000" + this.props.video.video}
            type={this.props.video.file_type}
          ></video>
        </div>

        {this.state.modal ? (
          <SingleVideoPlayerModal video={this.props.video} close={this.closeModalWindow}/>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playState: state.videoReducer.playState,
  playMode: state.videoReducer.playMode,
});

export default connect(mapStateToProps)(VideoPlayer);
