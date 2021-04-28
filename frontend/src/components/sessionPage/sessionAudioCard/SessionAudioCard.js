import React, { Component, Fragment } from "react";

import classes from "./SessionAudioCard.module.css";
import AddAudio from "../../modals/addAudio/AddAudio";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import AudioPlayer from "../../modals/audioPlayer/AudioPlayer";
import ErrorBoundry from "../../ErrorBoundry";

class SessionAudioCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      deleting: false,
      audioPlay: false,
    };
  }

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// functions ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // close audio add popup window
  closeAddWindow = () => {
    this.setState({ adding: false });
  };

  // close audio delete confirmation alert box
  closeDeleteConfirmPopup = (res) => {
    this.setState({ deleting: false });
  };

  // convert seconds to HH:mm:ss format
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

  openAudioPlayer = () => {
    this.setState({ audioPlay: true });
  };

  closeAudioPlayer = () => {
    this.setState({ audioPlay: false });
  };

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// event handlers ///////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // open the audio add popup window
  addHandler = () => {
    this.setState({ adding: true });
  };

  // open the delete alert
  deleteHandler = (audio) => {
    this.setState({ deleting: true });
  };

  render() {
    const { adding, deleting } = this.state;
    const { audio } = this.props;

    let cardContent;
    if (this.props.audio) {
      cardContent = (
        <div className={classes.card_content}>
          <div className={classes.audioplay} onClick={this.openAudioPlayer}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15 20.016v-8.016h-6v8.016h6zM14.859 10.031q0.469 0 0.797 0.328t0.328 0.797v9.703q0 0.469-0.328 0.797t-0.797 0.328h-5.719q-0.469 0-0.797-0.328t-0.328-0.797v-9.703q0-0.469 0.328-0.82t0.797-0.352zM12 0.984q1.875 0 4.125 0.938t3.609 2.297l-1.406 1.406q-2.625-2.625-6.328-2.625t-6.328 2.625l-1.406-1.406q3.234-3.234 7.734-3.234zM6.984 7.078q2.063-2.063 5.016-2.063t5.016 2.063l-1.453 1.406q-1.453-1.453-3.563-1.453t-3.563 1.453z"></path>
            </svg>
          </div>

          <div className={classes.info}>
            <div className={classes.info_1}>
              <span className={classes.info_1_1}>
                Duration: {audio ? this.convertSec(audio.duration) : 0}
              </span>
            </div>

            <div className={classes.info_2}>
              <button
                onClick={this.deleteHandler.bind(this, audio)}
                className={classes.removebtn}
              >
                Delete
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
              <title>Add Audio</title>
              <path d="M8.016 13.031l3.984-4.031 3.984 4.031-1.406 1.406-1.594-1.594v4.172h-1.969v-4.172l-1.594 1.594zM20.016 18v-9.984h-16.031v9.984h16.031zM20.016 6q0.797 0 1.383 0.609t0.586 1.406v9.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h6l2.016 2.016h8.016z"></path>
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        {cardContent}

        {adding ? (
          <ErrorBoundry>
            <AddAudio close={this.closeAddWindow} />
          </ErrorBoundry>
        ) : null}

        {deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            many={false}
            type="audio"
            header={"audio"}
            data={audio ? audio.id : null}
          />
        ) : null}

        {this.state.audioPlay ? (
          <AudioPlayer close={this.closeAudioPlayer} audio={audio} />
        ) : null}
      </div>
    );
  }
}

export default SessionAudioCard;
