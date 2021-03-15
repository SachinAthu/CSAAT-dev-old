import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from "jquery";
import jQuery from "jquery";

import classes from "./ControlPanel.module.css";

import {
  tooglePlayMode,
  playAll,
  pauseAll,
  stopAll,
  setPercentTimeline,
} from "../../../../actions/VideoActions";
import { PLAY_STATUS } from "../../../../actions/Types";

class ControlPanel extends Component {
  static propTypes = {
    playState: PropTypes.string,
    percent: PropTypes.number,
    currentTime: PropTypes.number,
    totalTime: PropTypes.number,
    tooglePlayMode: PropTypes.func.isRequired,
    playAll: PropTypes.func.isRequired,
    pauseAll: PropTypes.func.isRequired,
    stopAll: PropTypes.func.isRequired,
    setPercentTimeline: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// functions ////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  convertSec = (sec) => {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
    let MHSTime = measuredTime.toISOString().substr(11, 8);
    return MHSTime;
  };

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// event listeners /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  onChangeListener = (e) => {
    // console.log(e.target.value)
    this.props.setPercentTimeline(parseInt(e.target.value));
  };

  render() {
    const percent = this.props.percent;
    return (
      <div className={classes.controlPanel}>
        <div id="controlPanel_progressBar" className={classes.progressBar}>
          <span> {this.convertSec(this.props.currentTime)} </span>
          <input
            type="range"
            onChange={this.onChangeListener}
            className={classes.inputRange__slider}
            min="0"
            max="100"
            step="1"
            value={percent}
          />
          <span> {this.convertSec(this.props.totalTime)} </span>
        </div>

        <div className={classes.controlers}>
          <button className={classes.backwardBtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Backward</title>
              <path d="M9.516 12l8.484-6v12zM6 6h2.016v12h-2.016v-12z"></path>
            </svg>
          </button>

          {this.props.playState === PLAY_STATUS.PAUSE ||
          this.props.playState === PLAY_STATUS.STOP ? (
            <button onClick={this.props.playAll} className={classes.playBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Play</title>
                <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
              </svg>
            </button>
          ) : null}

          {this.props.playState === PLAY_STATUS.PLAY ? (
            <button onClick={this.props.pauseAll} className={classes.pauseBtn}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Pause</title>
                <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
              </svg>
            </button>
          ) : null}

          <button onClick={this.props.stopAll} className={classes.stopBtn}>
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

          <button className={classes.forwardBtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Forward</title>
              <path d="M15.984 6h2.016v12h-2.016v-12zM6 18v-12l8.484 6z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  percent: state.videoReducer.percent,
  currentTime: state.videoReducer.currentTime,
  totalTime: state.videoReducer.totalTime,
  playState: state.videoReducer.playState,
});

export default connect(mapStateToProps, {
  tooglePlayMode,
  playAll,
  pauseAll,
  stopAll,
  setPercentTimeline,
})(ControlPanel);
