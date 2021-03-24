import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import NoVideosSVG from "../../../assets/svg/no_videos.svg";
import Player from "../../player/Player";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import classes from "./VideoPlay.module.css";
import ControlPanel from './controlPanel/ControlPanel'

import { tooglePlayMode, playAll, pauseAll, stopAll } from '../../../actions/VideoActions'

class VideoPlay extends Component {
  static propTypes = {
    profile: PropTypes.object,
    videos: PropTypes.array,
    activeSession: PropTypes.object,
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
  // format date
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

   // close the delete confirm alert
  closeDeleteConfirmPopup = (res) => {
    // console.log(res);
    this.setState({ deleting: false });
  };

  ////////////////////////////////////////////////////////////////////////
  /////////////////////// event listener /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  // open the delete confirm alert
  deleteSessionHandler = () => {
    // open delete confirm box
    this.setState({ deleting: true });
  };

  // navigate to the session detail page to edit current selected session
  editSessionHandler = () => {
    //this.setState({ addSession: true });
    this.props.history.push({
      pathname: `/${this.props.profile.id}/${this.props.activeSession.id}`,
      state: { isNew: false },
    });
  };

  render() {
    // console.log(this.props)
    const activeSession = this.props.activeSession;
    const videos = this.props.videos;
    // console.log(activeSession);

    let video_list = [];

    for (let i = 0; i < 4; i++) {
      if (videos[i]) {
        video_list.push(videos[i]);
      } else {
        video_list.push(null);
      }
    }

    return (
      <div className={classes.container}>
        <div className={classes.container_1}>
          {activeSession ? (
            <span className={classes.date}>{activeSession.date}</span>
          ) : (
            <span className={classes.date}>No date & time mentioned</span>
          )}

          <div className={classes.container_1_btns}>
            <button
              className={classes.editbtn}
              onClick={this.editSessionHandler.bind(this)}
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
              className={classes.removebtn}
              onClick={this.deleteSessionHandler.bind(this, activeSession.id)}
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

        {videos.length > 0 ? (
          <div>
            <div className={classes.players}>
              {video_list.map((video, index) => (
                <div className={classes.player} key={index}>
                  {video ? (
                    <Player
                      key={Math.random()}
                      video={video}
                      width={0}
                      height={0}
                      fluid={true}
                      autoplay={false}
                      controls={false}
                      muted={false}
                      loop={false}
                      first={index === 1 ? true : false}
                    />
                  ) : (
                    <div
                      className={classes.empty_video}
                      onClick={this.editSessionHandler.bind(this)}
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

            <ControlPanel />
          </div>
        ) : (
          <div className={classes.novideo}>
            <img src={NoVideosSVG} alt="No Videos Image" />
            <h6>No available videos to load</h6>
            <button onClick={this.editSessionHandler.bind(this)}>
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
            data={activeSession.id}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  videos: state.videoReducer.videos,
  activeSession: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, { tooglePlayMode, playAll, pauseAll, stopAll })(VideoPlay);
