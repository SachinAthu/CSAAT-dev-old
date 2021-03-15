import React, { Component } from "react";
import videojs from "video.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "video.js/dist/video-js.min.css";
import "@videojs/themes/dist/forest/index.css";
import styles from "./Player.module.css";

import { PLAY_MODES, PLAY_STATUS } from "../../actions/Types";
import { tooglePlayMode, setPercent, setTotalTime } from '../../actions/VideoActions'

class Player extends Component {
  static propTypes = {
    playState: PropTypes.string,
    currentTime: PropTypes.number,
    tooglePlayMode: PropTypes.func.isRequired,
    setPercent: PropTypes.func.isRequired,
    setTotalTime: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // console.log(this.props.first)

    // instantiate Video.js
    const videoJsOptions = {
      autoplay: this.props.autoplay,
      muted: this.props.muted,
      controls: this.props.controls,
      preload: "auto",
      inactivityTimeout: 0,
      playbackRates: [0.5, 1, 1.5, 2],
      aspectRatio: this.props.aspectRatio,
      loop: this.props.loop,
      sources: [
        {
          src: "http://localhost:8000" + this.props.video.video,
          type: this.props.video.file_type,
        },
      ],
    };

    if (this.props.fluid) {
      videoJsOptions.fluid = this.props.fluid;
    } else {
      videoJsOptions.fluid = this.props.fluid;
      videoJsOptions.width = this.props.width;
      videoJsOptions.height = this.props.height;
    }

    this.player = videojs(
      this.videoNode,
      videoJsOptions,
      function onPlayerReady() {
        // console.log("onPlayerReady", this);
      }
    );

    // set total time to redux store
    this.props.setTotalTime(parseInt(this.props.video.duration))

    if(this.props.first){
      var duration = this.props.video.duration
      this.player.ready(() => {
        this.player.on('timeupdate', () => {
          setInterval(() => {
            var t = Math.round(parseFloat(this.player.currentTime()))
            var l = parseFloat(duration)
            var p = Math.round((t / l) * 100)
            // console.log(p)
            this.props.setPercent(p, t)
          }, 1000)
        })
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("player state", this.props.playState);

    // if(this.props.currentTime){
    //   console.log(this.props.currentTime)
    //   this.player.currentTime(this.props.currentTime)
    // }

    switch (this.props.playState) {
      case PLAY_STATUS.PLAY:
        if (this.player.paused()) {
          this.player.play();
        }
        break

      case PLAY_STATUS.PAUSE:
        this.player.pause();
        break

      case PLAY_STATUS.STOP:
        this.player.pause()
        this.player.currentTime(0)
        break

      default:
        console.log('No valid command for player')
    }
   
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    // console.log('distroy', this.props.src)
    URL.revokeObjectURL(this.url);
  }

  // open up a popup to play a single video
  playSingleVideo = () => {

  }

  render() {
    return (
      <div className={styles.container} onClick={this.playSingleVideo}>
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-theme-forest "
          ></video>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playState: state.videoReducer.playState,
  currentTime: state.videoReducer.currentTime2,
});

export default connect(mapStateToProps, { tooglePlayMode, setPercent, setTotalTime })(Player);
