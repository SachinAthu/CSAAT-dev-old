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
    console.log(this.props.play)
    let url = ''

    if(this.props.play === true){
      url = 'http://127.0.0.1:8000' + this.props.src
    }else if(this.props.play === false){
      // make a blog url from video input
      url = URL.createObjectURL(this.props.src)
      
      console.log(this.props.src)
      console.log('url', url)
      console.log(this.props.play)
    }
    

    const videoJsOptions = {
      autoplay: false,
      controls: true,
      preload: 'auto',
      fluid: true,
      inactivityTimeout: 0,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [
        {
          src: url,
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
            key={this.props.src}
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-theme-forest "
          ></video>
        </div>
      </div>
    );
  }
}

export default Player;
