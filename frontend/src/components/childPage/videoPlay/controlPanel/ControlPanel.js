import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./ControlPanel.module.css";

import {
  tooglePlayMode,
  tooglePlayState,
} from "../../../../actions/VideoActions";
import { PLAY_STATUS, PLAY_MODES } from "../../../../actions/Types";

class ControlPanel extends Component {
  static propTypes = {
    playState: PropTypes.string,
    tooglePlayMode: PropTypes.func.isRequired,
    tooglePlayState: PropTypes.func.isRequired,
    videos: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      totalTime: 0,
      playState: PLAY_STATUS.STOP,
      maxVideo: {},
      percent: 0,
    };
  }

  componentDidMount() {
    this.setMax();
  }

  componentWillUnmount() {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
    const el = document.getElementById(
      this.state.maxVideo.id + this.state.maxVideo.name
    );
    if (el) {
      el.removeEventListener("timeupdate", this.timeUpdateListener);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// functions ////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  setMax = () => {
    const videos = this.props.videos;
    let max = 0;
    let maxV = {};
    for (let i = 0; i < videos.length; i++) {
      if (parseInt(videos[i].duration) > max) {
        max = parseInt(videos[i].duration);
        maxV = videos[i];
      }
    }
    this.setState({ totalTime: max, maxVideo: maxV });

    const el = document.getElementById(maxV.id + maxV.name);
    el.addEventListener("timeupdate", this.timeUpdateListener.bind(this, el));
  };

  timeUpdateListener = (el) => {
    let t = parseInt(el.currentTime);
    let p = (t / parseInt(this.state.maxVideo.duration)) * 100;
    // console.log(t)
    this.setState({ currentTime: t, percent: p });
  };

  convertSec = (sec) => {
    try {
      let measuredTime = new Date(null);
      measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    } catch (err) {
      return "00:00:00";
    }
  };

  playAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.play();
    }
    this.setState({ playState: PLAY_STATUS.PLAY });
  };

  pauseAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
    }
    this.setState({ playState: PLAY_STATUS.PAUSE });
  };

  stopAll = () => {
    this.props.tooglePlayMode(PLAY_MODES.SINGLE);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.pause();
      videoEl.currentTime = 0;
    }
    this.setState({ playState: PLAY_STATUS.STOP, currentTime: 0 });
  };

  backwardForwardAll = (type, len) => {
    this.props.tooglePlayMode(PLAY_MODES.ALL);
    const videos = this.props.videos;
    var t = this.state.currentTime;

    if (type === 0) {
      // backward
      t = t - len;
    } else {
      // forward
      t = t + len;
    }

    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.currentTime = t;
    }
    this.setState({ currentTime: t });
  };

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// event listeners /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  onChangeListener = (e) => {
    const p = e.target.value;
    const el = document.getElementById(
      this.state.maxVideo.id + this.state.maxVideo.name
    );
    el.removeEventListener("timeupdate", this.timeUpdateListener);

    let m = Math.round((this.state.totalTime * p) / 100);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      // console.log(videoEl.duration)
      const d = videoEl.duration;
      const t = parseInt((d * p) / 100);
      videoEl.currentTime = t;
      // console.log(t)
    }
    this.setState({ currentTime: m, percent: p });
    el.addEventListener("timeupdate", this.timeUpdateListener);
  };

  onMouseUpListener = (e) => {
    console.log(e.target.value);
  };

  render() {
    return (
      <div className={classes.controlPanel}>
        <div id="controlPanel_progressBar" className={classes.progressBar}>
          <input
            type="range"
            onChange={this.onChangeListener}
            onMouseUp={this.onMouseUpListener}
            className={classes.inputRange__slider}
            min="0"
            max="100"
            step="0.1"
            value={this.state.percent}
          />
        </div>

        <div className={classes.controlers}>
          <span className={classes.currentTime}>
            {" "}
            {this.convertSec(this.state.currentTime)}{" "}
          </span>

          <button
            onClick={this.backwardForwardAll.bind(this, 0, 30)}
            className={classes.backwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <title>Backward 30s</title>
              <path d="M27.297 2.203c0.391-0.391 0.703-0.25 0.703 0.297v23c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v11.094c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v10.594c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-22c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v10.594c0.047-0.109 0.109-0.203 0.203-0.297l11.094-11.094c0.391-0.391 0.703-0.25 0.703 0.297v11.094c0.047-0.109 0.109-0.203 0.203-0.297z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 0, 5)}
            className={classes.backwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="28"
              viewBox="0 0 16 28"
            >
              <title>Backward 5s</title>
              <path d="M15.297 2.203c0.391-0.391 0.703-0.25 0.703 0.297v23c0 0.547-0.313 0.688-0.703 0.297l-11.094-11.094c-0.094-0.094-0.156-0.187-0.203-0.297v10.594c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-22c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v10.594c0.047-0.109 0.109-0.203 0.203-0.297z"></path>
            </svg>
          </button>

          {this.state.playState === PLAY_STATUS.PAUSE ||
          this.state.playState === PLAY_STATUS.STOP ? (
            <button onClick={this.playAll} className={classes.playBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Play</title>
                <path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path>
              </svg>
            </button>
          ) : null}

          {this.state.playState === PLAY_STATUS.PLAY ? (
            <button onClick={this.pauseAll} className={classes.pauseBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Pause</title>
                <path d="M12.984 15.984v-7.969h2.016v7.969h-2.016zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9 15.984v-7.969h2.016v7.969h-2.016z"></path>
              </svg>
            </button>
          ) : null}

          <button onClick={this.stopAll} className={classes.stopBtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Stop</title>
              <path d="M6 6h12v12h-12v-12z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 1, 5)}
            className={classes.forwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="28"
              viewBox="0 0 16 28"
            >
              <title>Forward 5s</title>
              <path d="M0.703 25.797c-0.391 0.391-0.703 0.25-0.703-0.297v-23c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-10.594c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v22c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-10.594c-0.047 0.109-0.109 0.203-0.203 0.297z"></path>
            </svg>
          </button>

          <button
            onClick={this.backwardForwardAll.bind(this, 1, 30)}
            className={classes.forwardBtn}
          >
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <title>Forward 30s</title>
              <path d="M0.703 25.797c-0.391 0.391-0.703 0.25-0.703-0.297v-23c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-11.094c0-0.547 0.313-0.688 0.703-0.297l11.094 11.094c0.094 0.094 0.156 0.187 0.203 0.297v-10.594c0-0.547 0.453-1 1-1h2c0.547 0 1 0.453 1 1v22c0 0.547-0.453 1-1 1h-2c-0.547 0-1-0.453-1-1v-10.594c-0.047 0.109-0.109 0.203-0.203 0.297l-11.094 11.094c-0.391 0.391-0.703 0.25-0.703-0.297v-11.094c-0.047 0.109-0.109 0.203-0.203 0.297z"></path>
            </svg>
          </button>

          <span className={classes.totalTime}>
            {" "}
            {this.convertSec(this.state.totalTime)}{" "}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playState: state.videoReducer.playState,
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, {
  tooglePlayMode,
  tooglePlayState,
})(ControlPanel);
