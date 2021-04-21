import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./SessionAudioCard.module.css";
import AddAudio from "../../modals/addAudio/AddAudio";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import AudioPlayer from "../../modals/audioPlayer/AudioPlayer";

class SessionAudioCard extends Component {
  static propTypes = {
    activeChild: PropTypes.object.isRequired,
    activeSession: PropTypes.object,
    audio: PropTypes.object,
  };

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
    // console.log(res);
    this.setState({ deleting: false });
  };

  // convert seconds to HH:mm:ss format
  convertSec = (sec) => {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(parseInt(sec)); // specify value of SECONDS
    let MHSTime = measuredTime.toISOString().substr(11, 8);
    return MHSTime;
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

  // open the audio add popup window for editting
  editHandler = (audio) => {
    console.log(audio);
    this.setState({ adding: true });
  };

  // open the delete alert
  deleteHandler = (audio) => {
    // console.log(audio)
    this.setState({ deleting: true });
  };

  render() {
    const { adding, deleting } = this.state;
    const { audio } = this.props;

    console.log(this.props.audio);

    let cardContent;
    if (this.props.audio) {
      cardContent = (
        <div className={classes.card_content} onClick={this.openAudioPlayer}>
          <div className={classes.audioplay}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path d="M30 0h2v23c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-11.501l-16 3.556v15.444c0 2.761-3.134 5-7 5s-7-2.239-7-5c0-2.761 3.134-5 7-5 1.959 0 3.729 0.575 5 1.501v-19.501l18-4z"></path>
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
                onClick={this.editHandler.bind(this, audio)}
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
                onClick={this.deleteHandler.bind(this, audio)}
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
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <title>Add Audio</title>
              <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.121 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841v0zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268v0zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
              <path d="M23.634 12.227c-0.232-0.19-0.536-0.266-0.83-0.207l-10 2c-0.467 0.094-0.804 0.504-0.804 0.981v7.402c-0.588-0.255-1.271-0.402-2-0.402-2.209 0-4 1.343-4 3s1.791 3 4 3 4-1.343 4-3v-7.18l8-1.6v4.183c-0.588-0.255-1.271-0.402-2-0.402-2.209 0-4 1.343-4 3s1.791 3 4 3 4-1.343 4-3v-10c0-0.3-0.134-0.583-0.366-0.773z"></path>
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className={classes.container}>
        {cardContent}

        {adding ? <AddAudio audio={audio} close={this.closeAddWindow} /> : null}

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

const mapStateToProps = (state) => ({
  activeChild: state.childReducer.activeChild,
  activeSession: state.sessionReducer.activeSession,
  audio: state.audioReducer.audio,
});

export default connect(mapStateToProps)(SessionAudioCard);
