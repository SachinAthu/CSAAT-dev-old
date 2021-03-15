import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./AddVideo.module.css";
import DragDropField from "../../../dragDropField/DragDropField";
import BtnSpinner from "../../../spinners/btn/BtnSpinner";

import { addVideo, updateVideo } from "../../../../actions/VideoActions";
import { getCameras, getCameraAngles } from "../../../../actions/CameraActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddVideo extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    activeSession: PropTypes.object,
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
      progress: 0,
      progressBar: false,
    };
    const cancelToken = axios.CancelToken;
    this.cancelTokenSource = cancelToken.source();
  }

  componentDidMount() {
    this.fetchCameras();
    this.fetchCameraAngles();

    const vid = this.props.video;

    if (vid) {
      this.setState({
        camera: vid.camera,
        camera_angle: vid.camera_angle,
        description: vid.description,
        video: vid.video,
        name: vid.name,
        duration: vid.duration,
      });
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// functions ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
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

    modal.classList.add(`${classes.fadeout}`);
    overlay.classList.add(`${classes.overlay_fadeout}`);

    setTimeout(() => {
      this.props.close();
    }, 300);
  };

  // get video duration
  getDuration = (file) => {
    const videoEl = document.getElementById("videoEl");
    const objectUrl = URL.createObjectURL(file);
    videoEl.setAttribute("src", objectUrl);
    let time;

    videoEl.addEventListener("canplaythrough", function (e) {
      time = Math.round(e.currentTarget.duration);
      URL.revokeObjectURL(objectUrl);
    });

    setTimeout(() => {
      this.setState({ duration: time });
    }, 100);
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

  showFinalRes = (class_a, class_r, msg) => {
    const res_span = document.getElementById("videoaddedit_final_res");
    res_span.innerHTML = msg;
    res_span.classList.remove(class_r);
    res_span.classList.add(class_a);
  };

  cancelUpload = () => {
    this.cancelTokenSource.cancel("Uploading cancelled!");
  };

  upload = async (formData) => {
    let url = `http://localhost:8000/api/add-video/`;
    let method = "POST";
    if (this.props.video) {
      // update
      url = `http://localhost:8000/api/update-video/${this.props.video.id}/`;
      method = "PUT";
    }

    axios(url, {
      method: method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        this.setState({
          progress: Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          ),
        });
      },
      cancelToken: this.cancelTokenSource.token,
    })
      .then((res) => {
        console.log("video uploaded", res.data);
        this.showFinalRes(
          `${classes.success}`,
          `${classes.fail}`,
          "Video uploaded successfully!"
        );
        if(this.props.video){
          this.props.updateVideo(res.data);
        }else{
          this.props.addVideo(res.data);
        }

        // show result success
        this.setState({ loading: false, progressBar: false });
        setTimeout(() => {
          this.close();
        }, 1000);
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
          this.showFinalRes(
            `${classes.fail}`,
            `${classes.success}`,
            thrown.message
          );
        } else {
          // show result fail
          this.showFinalRes(
            `${classes.fail}`,
            `${classes.success}`,
            "Uploading failed. Try again!"
          );
        }
        this.setState({ loading: false });
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// event handlers ////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  onSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      camera,
      camera_angle,
      description,
      video,
      duration,
    } = this.state;
    // console.log(video)
    // return
    // validation
    //

    this.setState({ loading: true, progressBar: true });

    let formData = new FormData();
    formData.append("profile", this.props.profile.id);
    formData.append("session", this.props.activeSession.id);
    formData.append("description", description);
    formData.append("camera", camera);
    formData.append("camera_angle", camera_angle);
    formData.append("name", name);

    if (typeof video != "string") {
      formData.append("video", video);
      formData.append("file_type", video.type);

      // get duration
      this.getDuration(video);
      setTimeout(() => {
        formData.append("duration", this.state.duration);
        this.upload(formData);
      }, 200);
    } else {
      this.upload(formData);
    }

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

  render() {
    const {
      camera,
      camera_angle,
      description,
      video,
      name,
      loading,
      progress,
    } = this.state;
    const { cameras, camera_angles } = this.props;

    return (
      <Fragment>
        <div className={classes.container} id="videoAddWindow">
          <button onClick={() => this.close()} className={classes.closebtn}>
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

          <h4>{this.props.video ? "Edit Video" : "New Video"}</h4>

          <form className={classes.form} onSubmit={this.onSubmit.bind(this)}>
            <div className={classes.formgroup}>
              <label htmlFor="video_add_form_camera">CAMERA</label>

              {cameras.length > 0 ? (
                <Fragment>
                  <select
                    name="camera"
                    id="video_add_form_camera"
                    onChange={this.onChange}
                  >
                    <option defaultChecked={true} value={null}>
                      Select the camera..
                    </option>
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

            <div className={classes.formgroup}>
              <label htmlFor="video_add_form_camera_angle">CAMERA ANGLE</label>

              {camera_angles.length > 0 ? (
                <Fragment>
                  <select
                    name="camera_angle"
                    id="video_add_form_camera_angle"
                    onChange={this.onChange}
                  >
                    <option value={null} defaultChecked={true}>
                      Select the camera angle..
                    </option>
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

            <div className={classes.formgroup}>
              <label htmlFor="video_add_form_description">DESCRIPTION</label>
              <textarea
                name="description"
                id="video_add_form_description"
                rows={4}
                onChange={this.onChange}
              ></textarea>
            </div>

            <div className={classes.formgroup2}>
              <label>Video</label>

              <DragDropField
                file={video}
                filename={name}
                onChange={this.onVideoFieldChange}
              />
            </div>

            {this.state.progressBar ? (
              <div className={classes.progress}>
                <div className={classes.progress_1}>
                  <span>Uploading.. {progress}%</span>
                </div>

                <div className={classes.progress_2}>
                  <div className={`progress ${classes.progressBar}`}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progress}%`,
                        background: "rgb(0, 156, 234)",
                      }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>

                  <div className={classes.cancelBtn}>
                    <button onClick={this.cancelUpload}>
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <title>Cancel</title>
                        <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={`${classes.result_div}`}>
              <span id="videoaddedit_final_res"></span>
            </div>

            <div className={classes.formgroup3}>
              <button
                type="button"
                className={`.button_reset ${classes.resetbtn}`}
                onClick={this.resetForm}
              >
                Reset
              </button>
              <button
                type="submit"
                className={`.button_primary ${classes.submitbtn}`}
              >
                {loading ? <BtnSpinner /> : null}
                {this.props.video ? "EDIT" : "ADD"}
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

        <div className={classes.overlay} id="videoAddWindowOverlay"></div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  activeSession: state.sessionReducer.activeSession,
  cameras: state.cameraReducer.cameras,
  camera_angles: state.cameraReducer.camera_angles,
});

export default connect(mapStateToProps, {
  getCameras,
  getCameraAngles,
  addVideo,
  updateVideo,
})(AddVideo);
