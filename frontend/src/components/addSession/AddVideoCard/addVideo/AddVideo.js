import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import styles from "./AddVideo.module.css";
import DragDropField from "../../../dragDropField/DragDropField";
import BtnSpinner from '../../../spinners/btn/BtnSpinner'

import {addVideo, updateVideo} from '../../../../actions/VideoActions'
import { getCameras, getCameraAngles } from "../../../../actions/CameraActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddVideo extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    session: PropTypes.object,
    cameras: PropTypes.array,
    camera_angles: PropTypes.array,
    getCameras: PropTypes.func.isRequired,
    getCameraAngles: PropTypes.func.isRequired,
    addVideo: PropTypes.func.isRequired,
    updateVideo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      camera: "",
      camera_angle: "",
      description: "",
      video: "",
      name: "",
      duration: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchCameras();
    this.fetchCameraAngles();

    const vid = this.props.video

    if(vid){
      this.setState({
        camera: vid.camera,
        camera_angle: vid.camera_angle,
        description: vid.description,
        video: vid.video,
        name: vid.name,
        duration: vid.duration,
      })
    }

  }

  fetchCameras = () => {
    axios
      .get("http://localhost:8000/api/cameras/")
      .then((res) => {
        // console.log(res.data);
        this.props.getCameras(res.data);
        this.setState({ camera: res.data[0].id });
      })
      .catch((err) => console.log(err));
  };

  fetchCameraAngles = () => {
    axios
      .get("http://localhost:8000/api/camera-angles/")
      .then((res) => {
        // console.log(res.data);
        this.props.getCameraAngles(res.data);
        this.setState({ camera_angle: res.data[0].id });
      })
      .catch((err) => console.log(err));
  };

  close = () => {
    const modal = document.getElementById("videoAddWindow");
    const overlay = document.getElementById("videoAddWindowOverlay");

    modal.classList.add(`${styles.fadeout}`);
    overlay.classList.add(`${styles.overlay_fadeout}`);

    setTimeout(() => {
      this.props.close();
    }, 300);
  };

  // get video duration
  getDuration = (file) => {
    const videoEl = document.getElementById("videoEl");
    const objectUrl = URL.createObjectURL(file);
    videoEl.setAttribute("src", objectUrl);
    let time = "";

    videoEl.addEventListener("canplaythrough", function (e) {
      let sec = Math.round(e.currentTarget.duration);

      //convert seconds to time hour:min:sec
      sec = parseFloat(sec.toFixed(2));
      let hours = Math.floor(sec / 3600);
      let minutes = Math.floor((sec - hours * 3600) / 60);
      let seconds = sec - hours * 3600 - minutes * 60;
      seconds = seconds.toFixed(0);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      time = hours + ":" + minutes + ":" + seconds;
      URL.revokeObjectURL(objectUrl);
    });

    setTimeout(() => {
      this.setState({ duration: time });
    }, 100);
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({loading: true})

    // get duration
    this.getDuration(this.state.video);
    setTimeout(() => {
      const { name, camera, camera_angle, description, video, duration } = this.state;
      const videoObj = {
        id: this.props.card_id,
        profile: this.props.profile.id,
        session: this.props.session ? this.props.session.id : null,
        camera: camera,
        name: name,
        description: description,
        video: video,
        type: video.type,
        camera_angle: camera_angle,
        duration: duration,
      };

      if(this.props.video){
        videoObj.isNew = false
        console.log('update called')
        // update the redux store
        this.props.updateVideo(videoObj)
      }else{
        videoObj.isNew = true
        // add video to redux store
        this.props.addVideo(videoObj);
      }

      setTimeout(() => {
        this.setState({loading: false})
        this.close();
      }, 1000);
    }, 150);
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onVideoFieldChange = (file) => {
    this.setState({
      video: file,
      name: file.name,
    });
  };

  resetForm = () => {
    const v = this.props.video;

    if (v) {
      this.setState({
        camera: v.camera ? v.camera : "",
        camera_angle: v.camera_angle ? v.camera_angle : "",
        description: v.description ? v.description : "",
        video: v.video ? v.video : "",
        name: v.name ? v.name : "",
      });
    } else {
      this.setState({
        camera: "",
        camera_angle: "",
        description: "",
        video: "",
        name: "",
      });
    }
  };

  render() {
    const { camera, camera_angle, description, video, name, loading } = this.state;
    const { cameras, camera_angles } = this.props;

    return (
      <Fragment>
        <div className={styles.container} id="videoAddWindow">
          <button onClick={() => this.close()} className={styles.closebtn}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Close</title>
              <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
            </svg>
          </button>

          <h4>{this.props.video ? 'Edit Video' : 'New Video'}</h4>

          <form className={styles.form} onSubmit={this.onSubmit.bind(this)}>
            <div className={styles.formgroup}>
              <label htmlFor="video_add_form_camera">CAMERA</label>

              {cameras.length > 0 ? (
                <Fragment>
                  <select
                    name="camera"
                    id="video_add_form_camera"
                    onChange={this.onChange}
                  >
                    {cameras.map((c, i) => (
                      <option key={i} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Fragment>
              ) : (
                <select></select>
              )}
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="video_add_form_camera_angle">CAMERA ANGLE</label>

              {camera_angles.length > 0 ? (
                <Fragment>
                  <select
                    name="camera_angle"
                    id="video_add_form_camera_angle"
                    onChange={this.onChange}
                  >
                    {camera_angles.map((c, i) => (
                      <option key={i} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Fragment>
              ) : (
                <select></select>
              )}
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="video_add_form_description">DESCRIPTION</label>
              <textarea
                name="description"
                id="video_add_form_description"
                rows={4}
                onChange={this.onChange}
              ></textarea>
            </div>

            <div className={styles.formgroup2}>
              <label>Video</label>

              <DragDropField
                file={video}
                filename={name}
                onChange={this.onVideoFieldChange}
              />
            </div>

            <div className={styles.formgroup3}>
              <button
                type="button"
                className={`.button_reset ${styles.resetbtn}`}
                onClick={this.resetForm}
              >
                Reset
              </button>
              <button
                type="submit"
                className={`.button_primary ${styles.submitbtn}`}
              >
                {loading ? <BtnSpinner /> : null}
                {this.props.video ? 'EDIT' : 'ADD'}
              </button>
            </div>
          </form>
        </div>

        <video
          controls
          width="500px"
          id="videoEl"
          style={{ display: "none" }}
        ></video>

        <div className={styles.overlay} id="videoAddWindowOverlay"></div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  session: state.sessionReducer.activeSession,
  cameras: state.cameraReducer.cameras,
  camera_angles: state.cameraReducer.camera_angles,
});

export default connect(mapStateToProps, {
  getCameras,
  getCameraAngles,
  addVideo,
  updateVideo,
})(AddVideo);
