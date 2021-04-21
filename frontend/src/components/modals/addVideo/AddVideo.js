import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./AddVideo.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import DragDropField from "../../layouts/dragDropField/DragDropField";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import { BASE_URL } from '../../../config'

import { addVideo, updateVideo } from "../../../actions/VideoActions";
import { getCameras, getCameraAngles } from "../../../actions/CameraActions";
import { CHILD_TYPES } from "../../../actions/Types";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddVideo extends Component {
  static propTypes = {
    activeChild: PropTypes.object.isRequired,
    childType: PropTypes.string.isRequired,
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
  // fetch camera details fromdb for the input field
  fetchCameras = () => {
    axios
      .get(`${BASE_URL}/cameras/`)
      .then((res) => {
        // console.log(res.data);
        this.props.getCameras(res.data);
        this.setState({ camera: res.data[0].id });
      })
      .catch((err) => console.log(err));
  };

  // fetch camera angle details fromdb for the input field
  fetchCameraAngles = () => {
    axios
      .get(`${BASE_URL}/camera-angles/`)
      .then((res) => {
        // console.log(res.data);
        this.props.getCameraAngles(res.data);
        this.setState({ camera_angle: res.data[0].id });
      })
      .catch((err) => console.log(err));
  };

  // get the duration of selected video file
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

  // reset the form
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

  // cancel the uploading
  cancelUpload = () => {
    this.cancelTokenSource.cancel("Uploading cancelled!");
  };

  
  checkSelectField = (inputVal, errorField, errorText) => {
    if (
      inputVal == null ||
      inputVal === "" ||
      inputVal === "Select the camera.." || inputVal === "Select the camera angel.."
      ) {
        this.showError(errorField, errorText);
        return false;
      } else {
      this.removeError(errorField);
      return true;
    }
  };
  
  checkVideoField = (file, errorField) => {
    if (!file || file === "") {
      this.showError(errorField, "Video is required");
      return false;
    } else if (file.type.toLowerCase() !== "video/mp4") {
      this.showError(errorField, "Video must be .mp4");
      return false;
    } else {
      this.removeError(errorField);
      return true;
    }
  };

  checkAllFields = () => {
    const { camera, camera_angle, description, video } = this.state;
    
    // camera
    const camera_e = document.getElementById("video_add_form_camera_error");
    const r1 = this.checkSelectField(camera, camera_e, "Camera is required");
    
    // camera_angle
    const camera_angle_e = document.getElementById(
      "video_add_form_camera_angle_error"
      );
      const r2 = this.checkSelectField(
        camera_angle,
        camera_angle_e,
        "Camera angle is required"
        );
        
        // video
        const video_e = document.getElementById("video_add_form_video_error");
        const r3 = this.checkVideoField(video, video_e, "Video must be .mp4");
        
        if (r1 && r2 && r3) {
          return true;
        } else {
          return false;
        }
        
      };
      
      showError = (errorField, errorText) => {
        errorField.style.display = "block";
        errorField.innerHTML = errorText;
      };
      
  removeError = (errorField) => {
    errorField.innerHTML = "";
    errorField.style.display = "none";
  };
  
  showFailed = (msg) => {
    const resSpan = document.getElementById("video_add_failed");
    resSpan.innerHTML = msg;
  };
  
  // upload video
  upload = async (formData) => {
    let url = ""
    let method = "";
    if(this.props.childType === CHILD_TYPES.TYPICAL){
      if (this.props.video) {
        url = `${BASE_URL}/update-t-video/${this.props.video.id}/`;
        method = "PUT";
      }else{
        url = `${BASE_URL}/add-t-video/`;
        method = "POST";
      }
    }else{
      if (this.props.video) {
        url = `${BASE_URL}/update-at-video/${this.props.video.id}/`;
        method = "PUT";
      }else{
        url = `${BASE_URL}/add-at-video/`;
        method = "POST";
      }
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
        if (this.props.video) {
          this.props.updateVideo(res.data);
        } else {
          this.props.addVideo(res.data);
        }

        this.setState({ loading: false, progressBar: false });
        this.props.close()
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log("Uploading canceled", thrown.message);
          this.showFailed("Uploading cancelled!");
        } else {
          // show result fail
          this.showFailed("Uploading failed!");
        }
        this.setState({ loading: false });
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// event handlers ////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  // trigger when form submit button clicked
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
    const r =this.checkAllFields()
    if(!r) return

    this.setState({ loading: true, progressBar: true });

    let formData = new FormData();
    if(this.props.childType === CHILD_TYPES.TYPICAL){
      formData.append("tChild", this.props.activeChild.id);
    }else{
      formData.append("atChild", this.props.activeChild.id);
    }
    formData.append("session", this.props.activeSession.id);
    formData.append("description", description);
    formData.append("camera", camera);
    formData.append("camera_angle", camera_angle);

    if(video){
      formData.append("name", name);
      
    }

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

  // trigger when form field value change
  onChange = (e) => {
    switch (e.target.name) {
      case "camera":
        console.log(e.target.value);
        var errorField = document.getElementById("video_add_form_camera_error");
        this.checkSelectField(e.target.value, errorField, "Camera is required");
        break;

      case "camera_angle":
        var errorField = document.getElementById(
          "video_add_form_camera_angle_error"
        );
        this.checkSelectField(
          e.target.value,
          errorField,
          "Camera angle is required"
        );
        break;

      default:
        return;
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // trigger when fileuploadfield (DragDropField) return value changed
  onVideoFieldChange = (file) => {
    const videoE = document.getElementById("video_add_form_video_error");
    this.checkVideoField(file, videoE);
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
      <ModalFrame close={this.props.close}>
        <div className={classes.container}>
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

              <span
                id="video_add_form_camera_error"
                className={classes.fieldError}
              ></span>
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

              <span
                id="video_add_form_camera_angle_error"
                className={classes.fieldError}
              ></span>
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
                id="video_add_form_video"
                file={video}
                filename={name}
                onChange={this.onVideoFieldChange}
              />

              <span
                id="video_add_form_video_error"
                className={classes.fieldError}
              ></span>
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

          <span id="video_add_failed" className={classes.failed}></span>
        </div>

        <video
          controls
          width="500px"
          id="videoEl"
          style={{ display: "none" }}
        ></video>
      </ModalFrame>
    );
  }
}

const mapStateToProps = (state) => ({
  activeChild: state.childReducer.activeChild,
  childType: state.childReducer.childType,
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
