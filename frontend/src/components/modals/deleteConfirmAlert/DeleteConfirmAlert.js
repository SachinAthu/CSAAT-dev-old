import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./DeleteConfirmAlert.module.css";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import ModalFrame from "../modalFrame/ModalFrame";
import { BASE_URL } from "../../../config";

import { deleteChild } from "../../../actions/ChildActions";
import {
  setActiveSession,
  deleteSession,
} from "../../../actions/SessionActions";
import { getVideos, deleteVideo } from "../../../actions/VideoActions";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
} from "../../../actions/Types";
import { getAudio, deleteAudio } from "../../../actions/AudioActions";
import { deleteCamera } from "../../../actions/CameraActions";
import { deleteCameraAngle } from "../../../actions/CameraAngleActions";

class DeleteConformPopup extends Component {
  static propTypes = {
    activeSession: PropTypes.object,
    setActiveSession: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    deleteSession: PropTypes.func.isRequired,
    getVideos: PropTypes.func.isRequired,
    deleteVideo: PropTypes.func.isRequired,
    getAudio: PropTypes.func.isRequired,
    deleteAudio: PropTypes.func.isRequired,
    deleteCamera: PropTypes.func.isRequired,
    deleteCameraAngle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      isError: false,
    };
  }

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////
  deleteChilds = async (profiles = this.props.data) => {
    const childType = localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE);
    this.setState({ deleting: true });

    let url = "";
    if (childType === CHILD_TYPES.TYPICAL) {
      url = `${BASE_URL}/delete-t-child`;
    } else {
      url = `${BASE_URL}/delete-at-child`;
    }

    for (let i = 0; i < profiles.length; i++) {
      try {
        let res = await axios.delete(`${url}/${profiles[i].id}`);
        this.props.deleteChild(profiles[i].id);
        this.setState({ isError: false });
      } catch (err) {
        if (err) {
          this.setState({ isError: true });
        }
      }
    }

    this.setState({ deleting: false });
    this.props.close();
  };

  deleteSession = (sessionId = this.props.data) => {
    this.setState({ deleting: true });

    axios
      .delete(`${BASE_URL}/delete-session/${sessionId}`)
      .then((res) => {
        this.setState({ deleting: false });
        this.setState({ isError: false });

        const s = this.props.sessions.filter((s, i) => s.id != sessionId);
        // set active session
        this.props.setActiveSession(s[0]);

        // delete session from redux store
        this.props.deleteSession(sessionId);

        // fetch audio for the selected session from DB
        axios
          .get(`${BASE_URL}/audio/${s[0].id}/`)
          .then((res) => {
            this.props.getAudio(res.data[0]);
          })
          .catch((err) => {});

        // fetch videos for the selected session from DB
        axios
          .get(`${BASE_URL}/videos/${s[0].id}/`)
          .then((res) => {
            this.props.getVideos(res.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        this.setState({ isError: true });
      });

    this.setState({ deleting: false });
    setTimeout(() => {
      this.props.close();
    }, 200);
  };

  deleteVideo = (videoId = this.props.data) => {
    this.setState({ deleting: true });

    axios
      .delete(`${BASE_URL}/delete-video/${videoId}`)
      .then((res) => {
        this.setState({ isError: false });
        // remove from redux store
        this.props.deleteVideo(videoId);
      })
      .catch((err) => {
        this.setState({ isError: true });
      });

    this.setState({ deleting: false });
    this.props.close();
  };

  deleteAudio = (audioId = this.props.data) => {
    this.setState({ deleting: true });

    axios
      .delete(`${BASE_URL}/delete-audio/${audioId}/`)
      .then((res) => {
        this.setState({ isError: false });
        // remove from redux store
        this.props.deleteAudio(audioId);
      })
      .catch((err) => {
        this.setState({ isError: true });
      });

    this.setState({ deleting: false });
    this.props.close();
  };

  deleteCameras = async (cameras = this.props.data) => {
    this.setState({ deleting: true });

    for (let i = 0; i < cameras.length; i++) {
      try {
        let res = await axios.delete(
          `${BASE_URL}/delete-camera/${cameras[i].id}`
        );
        this.props.deleteCamera(cameras[i].id);
        this.setState({ isError: false });
      } catch (err) {
        if (err) {
          this.setState({ deleting: true });
          this.setState({ isError: true });
        }
      }
    }

    this.setState({ deleting: false });
    this.props.close();
  };

  deleteCameraAngles = async (cameraAngles = this.props.data) => {
    this.setState({ deleting: true });

    for (let i = 0; i < cameraAngles.length; i++) {
      try {
        let res = await axios.delete(
          `${BASE_URL}/delete-camera-angle/${cameraAngles[i].id}`
        );
        this.props.deleteCameraAngle(cameraAngles[i].id);
        this.setState({ isError: false });
      } catch (err) {
        if (err) {
          this.setState({ deleting: true });
          this.setState({ isError: true });
        }
      }
    }

    this.setState({ deleting: false });
    this.props.close();
  };

  /////////////////////////////////////////////////////
  ////////////////// event listeners //////////////////
  /////////////////////////////////////////////////////
  deleteHandler = () => {
    switch (this.props.type) {
      case "child":
        this.deleteChilds();
        break;
      case "session":
        this.deleteSession();
        break;
      case "video":
        this.deleteVideo();
        break;
      case "audio":
        this.deleteAudio();
        break;
      case "camera":
        this.deleteCameras();
        break;
      case "cameraAngle":
        this.deleteCameraAngles();
        break;
      default:
        return;
    }
  };

  render() {
    return (
      <ModalFrame close={() => this.props.close(true)}>
        <div className={classes.container} id="deleteConfirmWindow">
          <div className={classes.header}>
            <h3>Delete ?</h3>
            <span>
              Are you sure you want to delete this {this.props.header}
              {this.props.many ? "s" : null}? You can't undo this action.
            </span>
          </div>

          <div className={classes.actions}>
            <button
              type="button"
              className={`.button_primary ${classes.deletebtn}`}
              onClick={this.deleteHandler}
            >
              {this.state.deleting ? <BtnSpinner /> : null}
              Delete
            </button>

            <button
              type="button"
              className={`.button_reset ${classes.cancelbtn}`}
              onClick={() => this.props.close()}
            >
              Cancel
            </button>
          </div>

          {this.state.isError ? (
            <span id="delete_result" className={classes.result}>
              Deletion failed!
            </span>
          ) : null}
        </div>
      </ModalFrame>
    );
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessionReducer.sessions,
  activeSession: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, {
  deleteChild,
  setActiveSession,
  deleteSession,
  getVideos,
  deleteVideo,
  getAudio,
  deleteAudio,
  deleteCamera,
  deleteCameraAngle,
})(DeleteConformPopup);
