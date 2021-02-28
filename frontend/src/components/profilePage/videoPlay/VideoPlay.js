import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { Redirect } from "react-router-dom";

import styles from "./VideoPlay.module.css";
import NoVideosSVG from "./no_videos.svg";
import Player from "../../player/Player";
import DeleteConfirmPopup from "../../deleteConfirmPopup/DeleteConfirmPopup";

import { deleteSession } from "../../../actions/SessionActions";

class VideoPlay extends Component {
  static propTypes = {
    videos: PropTypes.array,
    activeSession: PropTypes.object,
    deleteSession: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      addSession: false,
      deleting: false,
    };
  }


  ///////////////////////////////////////////////////////////////////////
  //////////////////////////// functions ////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  getTime = (datetime) => {
    const day = datetime.slice(0, 10);
    let h = parseInt(datetime.slice(11, 13));
    let m = parseInt(datetime.slice(14, 16));
    let ap;
    let time;

    if (h < 12) {
      // AM
      ap = "AM";
    } else {
      // PM
      ap = "PM";
      h = h - 12;
    }

    h = h.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    m = m.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    time = `${day}  ${h}:${m} ${ap}`;
    return time;
  };

  closeDeleteConfirmPopup = (res) => {
    console.log(res);
    this.setState({ deleting: false });
  };


  ////////////////////////////////////////////////////////////////////////
  /////////////////////// event listener /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  deleteSessionHandler = (id) => {
    console.log(id);
    // open delete confirm box
    this.setState({deleting: true})
   
  };

  editSessionHandler = () => {
    //this.setState({ addSession: true });
  };

  render() {
    const activeSession = this.props.activeSession;
    const videos = this.props.videos;
    console.log(activeSession);

    let video_list = [];

    for (let i = 0; i < 4; i++) {
      if (videos[i]) {
        video_list.push(videos[i]);
      } else {
        video_list.push(null);
      }
    }

    return (
      <div className={styles.container}>
        <div className={styles.container_1}>
          {activeSession.date ? (
            <span className={styles.date}>{activeSession.date}</span>
          ) : (
            <span className={styles.date}>No date & time mentioned</span>
          )}

          <div className={styles.container_1_btns}>
            <button
              className={styles.editbtn}
              onClick={this.editSessionHandler}
            >
              Edit
            </button>

            <button
              className={styles.removebtn}
              onClick={this.deleteSessionHandler.bind(this, activeSession.id)}
            >
              Remove
            </button>
          </div>
        </div>

        {videos.length > 0 ? (
          <div className={styles.players}>
            {video_list.map((video, index) => (
              <div className={styles.player} key={index}>
                {video ? (
                  <Player src={video.video} />
                ) : (
                  <div
                    className={styles.empty_video}
                    onClick={this.editSessionHandler.bind(this, activeSession.id)}
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="28"
                      viewBox="0 0 24 28"
                    >
                      <title>Add Video</title>
                      <path d="M12 2c6.625 0 12 5.375 12 12s-5.375 12-12 12-12-5.375-12-12 5.375-12 12-12zM18 14.859c0.313-0.172 0.5-0.5 0.5-0.859s-0.187-0.688-0.5-0.859l-8.5-5c-0.297-0.187-0.688-0.187-1-0.016-0.313 0.187-0.5 0.516-0.5 0.875v10c0 0.359 0.187 0.688 0.5 0.875 0.156 0.078 0.328 0.125 0.5 0.125s0.344-0.047 0.5-0.141z"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.novideo}>
            <img src={NoVideosSVG} alt="No Videos Image" />
            <h6>No available videos to load</h6>
            <button onClick={this.editSessionHandler.bind(this, activeSession.id)}>
              Add Videos
            </button>
          </div>
        )}

        {this.state.deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            many={false}
            header={"session"}
            msg={
              "By deleting a session all referenced videos will also be deleted."
            }
            data={activeSession}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  videos: state.videoReducer.videos,
  activeSession: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, { deleteSession })(VideoPlay);
