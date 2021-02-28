import React, { Component } from "react";
import videojs from "video.js";

import 'video.js/dist/video-js.min.css'
import '@videojs/themes/dist/forest/index.css';
import styles from "./Player.module.css";

class Player extends Component {
  constructor(props){
      super(props)
  }
  
    componentDidMount() {
    // instantiate Video.js
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      preload: 'auto',
      fluid: false,
      inactivityTimeout: 0,
      playbackRates: [0.5, 1, 1.5, 2],
      aspectRatio:this.props.aspectRatio,
      sources: [
        {
          src: this.props.src,
          type: "video/mp4",
        },
      ],
    };

    this.player = videojs(this.videoNode, videoJsOptions, function onPlayerReady() {
      // console.log("onPlayerReady", this);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
    console.log('distroy', this.props.src)
    URL.revokeObjectURL(this.url);
  }

  render() {
    return (
      <div className={styles.container}>
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

export default Player;
