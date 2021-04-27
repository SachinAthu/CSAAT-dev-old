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
      fullView: false,
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
    if(el){
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
    this.setState({ currentTime: t, percent: p });
  };

  convertSec = (sec) => {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
    let MHSTime = measuredTime.toISOString().substr(11, 8);
    return MHSTime;
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

  fullView = () => {
    if (this.state.fullView) {
      this.props.tooglePlayMode(PLAY_MODES.SINGLE);
      this.setState({ fullView: false });

      document.exitFullscreen();
    } else {
      this.props.tooglePlayMode(PLAY_MODES.ALL);
      this.setState({ fullView: true });

      const el = document.getElementById("videoPlayContent");
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        /* Safari */
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        /* IE11 */
        el.msRequestFullscreen();
      }
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// event listeners /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  onChangeListener = (e) => {
    // console.log(e.target.value)
    const el = document.getElementById(
      this.state.maxVideo.id + this.state.maxVideo.name
    );
    el.removeEventListener("timeupdate", this.timeUpdateListener);

    let m = Math.round((this.state.totalTime * e.target.value) / 100);
    const videos = this.props.videos;
    for (let i = 0; i < videos.length; i++) {
      let videoEl = document.getElementById(videos[i].id + videos[i].name);
      videoEl.currentTime = m;
    }
    this.setState({ currentTime: m, percent: e.target.value });
  };

  render() {
    return (
      <div className={classes.controlPanel}>
        <div id="controlPanel_progressBar" className={classes.progressBar}>
          <input
            type="range"
            onChange={this.onChangeListener}
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

          <button onClick={this.fullView} className={classes.fullviewBtn}>
            {this.state.fullView ? (
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Exit Fullview</title>
                <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
              </svg>
            ) : (
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Fullview</title>
                <path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>
              </svg>
            )}
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
