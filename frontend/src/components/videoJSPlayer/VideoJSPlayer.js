import React, { Component } from "react";
import videojs from "video.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "video.js/dist/video-js.min.css";
import "@videojs/themes/dist/forest/index.css";
import classes from "./VideoJSPlayer.module.css";

import { PLAY_MODES, PLAY_STATUS } from "../../actions/Types";
import {
  tooglePlayMode,
} from "../../actions/VideoActions";

class VideoJSPlayer extends Component {
  static propTypes = {
    playState: PropTypes.string,
    tooglePlayMode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // instantiate Video.js
    const videoJsOptions = {
      autoplay: false,
      muted: true,
      controls: true,
      preload: "auto",
      inactivityTimeout: 0,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      loop: false,
      sources: [
        {
          src: "http://localhost:8000" + this.props.video.video,
          type: this.props.video.file_type,
        },
      ],
    };

    this.player = videojs(
      this.videoNode,
      videoJsOptions,
      function onPlayerReady() {
      }
    );

      

   
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    URL.revokeObjectURL(this.url);
  }

  render() {
    return (
      <div className={classes.container}>
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className={`video-js vjs-theme-forest ${classes.player}`}
          ></video>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  playState: state.videoReducer.playState,
});

export default connect(mapStateToProps, {
  tooglePlayMode,
})(VideoJSPlayer);
