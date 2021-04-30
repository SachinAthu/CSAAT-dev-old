import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "../../../assets/css/AddModal.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import DragDropField from "../../layouts/dragDropField/DragDropField";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import { BASE_URL } from "../../../config";

import { addVideo } from "../../../actions/VideoActions";
import { getCameras } from "../../../actions/CameraActions";
import { getCameraAngles } from '../../../actions/CameraAngleActions'
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
} from "../../../actions/Types";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddVideo extends Component {
  static propTypes = {
    cameras: PropTypes.array,
    cameraAngles: PropTypes.array,
    getCameras: PropTypes.func.isRequired,
    getCameraAngles: PropTypes.func.isRequired,
    addVideo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      camera: "",
      cameraAngle: "",
      description: "",
      video: "",
      name: "",
      duration: "",
      loading: false,
      progress: 0,
      progressBar: false,
      videoFieldError: false,
    };
    const cancelToken = axios.CancelToken;
    this.cancelTokenSource = cancelToken.source();
  }

  componentDidMount() {
    this.fetchCameras();
    this.fetchCameraAngles();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// functions ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  // fetch camera details fromdb for the input field
  fetchCameras = () => {
    axios
      .get(`${BASE_URL}/cameras/`)
      .then((res) => {
        this.props.getCameras(res.data);
      })
      .catch((err) => {});
  };

  // fetch camera angle details fromdb for the input field
  fetchCameraAngles = () => {
    axios
      .get(`${BASE_URL}/camera-angles/`)
      .then((res) => {
        this.props.getCameraAngles(res.data);
      })
      .catch((err) => {});
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

    this.setState({
      camera: "",
      cameraAngle: "",
      description: "",
      video: "",
      name: "",
    });

    const errorFields = document.getElementsByClassName(
      `${classes.fieldError}`
    );
    for (let i = 0; i < errorFields.length; i++) {
      errorFields[i].innerHTML = "";
      errorFields[i].style.display = "none";
    }
    const formGroups = document.getElementsByClassName(`${classes.formgroup}`);
    for (let i = 0; i < formGroups.length; i++) {
      formGroups[i].children[1].classList.remove(`${classes.errorBorder}`);
    }
    this.setState({ videoFieldError: false })
  };

  // cancel the uploading
  cancelUpload = () => {
    this.cancelTokenSource.cancel("Uploading cancelled!");
  };

  checkSelectField = (inputVal, field, errorField, errorText) => {
    if (
      !inputVal ||
      inputVal === "Select the camera.." ||
      inputVal === "Select the camera angle.."
    ) {
      this.showError(field, errorField, errorText);
      return false;
    } else {
      this.removeError(field, errorField);
      return true;
    }
  };

  checkVideoField = (file, errorField) => {
    if (!file || file === "") {
      this.showError(null, errorField, "Video is required");
      return false;
    } else if (file.type !== "video/mp4") {
      this.showError(null, errorField, "Video must be .mp4");
      return false;
    } else {
      this.removeError(null, errorField);
      return true;
    }
  };

  checkAllFields = () => {
    const { camera, cameraAngle, description, video } = this.state;

    // camera
    const camera_f = document.getElementById("video_add_form_camera");
    const camera_e = document.getElementById("video_add_form_camera_error");
    const r1 = this.checkSelectField(
      camera,
      camera_f,
      camera_e,
      "Camera is required"
    );

    // cameraAngle
    const cameraAngle_f = document.getElementById(
      "video_add_form_cameraAngle"
    );
    const cameraAngle_e = document.getElementById(
      "video_add_form_cameraAngle_error"
    );
    const r2 = this.checkSelectField(
      cameraAngle,
      cameraAngle_f,
      cameraAngle_e,
      "Camera angle is required"
    );

    // video
    const video_e = document.getElementById("video_add_form_video_error");
    const r3 = this.checkVideoField(video, video_e, "Video must be .mp4");

    if (!r3) {
      this.setState({ videoFieldError: true });
    } else {
      this.setState({ videoFieldError: false });
    }

    if (r1 && r2 && r3) {
      return true;
    } else {
      return false;
    }
  };

  showError = (field, errorField, errorText) => {
    errorField.style.display = "block";
    errorField.innerHTML = errorText;
    if (field) {
      field.classList.add(`${classes.errorBorder}`);
    }
  };

  removeError = (field, errorField) => {
    errorField.innerHTML = "";
    errorField.style.display = "none";
    if (field) {
      field.classList.remove(`${classes.errorBorder}`);
    }
  };

  showFailed = (msg) => {
    const resSpan = document.getElementById("video_add_failed");
    if(resSpan){
      resSpan.innerHTML = msg;
    } 
  };

  // upload video
  upload = async (formData) => {
    let url = "";
    if (
      localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE) === CHILD_TYPES.TYPICAL
    ) {
      url = `${BASE_URL}/add-t-video/`;
    } else {
      url = `${BASE_URL}/add-at-video/`;
    }

    axios(url, {
      method: 'POST',
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
        this.props.addVideo(res.data);
        this.setState({ loading: false, progressBar: false });
        this.props.close();
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
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
      cameraAngle,
      description,
      video,
      duration,
    } = this.state;

    // validation
    const r = this.checkAllFields();
    if (!r) return;

    this.setState({ loading: true, progressBar: true });

    let formData = new FormData();
    const activeChild = localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD);

    if (
      localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE) === CHILD_TYPES.TYPICAL
    ) {
      formData.append("tChild", activeChild);
    } else {
      formData.append("atChild", activeChild);
    }
    formData.append(
      "session",
      localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION)
    );
    formData.append("description", description);
    formData.append("camera", camera);
    formData.append("camera_angle", cameraAngle);
    formData.append("name", name);
    formData.append("video", video);
    formData.append("file_type", video.type);

    // get duration
    this.getDuration(video);
    setTimeout(() => {
      formData.append("duration", this.state.duration);
      this.upload(formData);
    }, 200);
  };

  // trigger when form field value change
  onChange = (e) => {
    switch (e.target.name) {
      case "camera":
        var field = document.getElementById("video_add_form_camera");
        var errorField = document.getElementById("video_add_form_camera_error");
        this.checkSelectField(
          e.target.value,
          field,
          errorField,
          "Camera is required"
        );
        break;

      case "cameraAngle":
        var field = document.getElementById("video_add_form_cameraAngle");
        var errorField = document.getElementById(
          "video_add_form_cameraAngle_error"
        );
        var r = this.checkSelectField(
          e.target.value,
          field,
          errorField,
          "Camera angle is required"
        );
        if (!r) {
          this.setState({ videoFieldError: true });
        } else {
          this.setState({ videoFieldError: false });
        }
        break;

      default:
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // trigger when fileuploadfield (DragDropField) return value changed
  onVideoFieldChange = (file) => {
    const videoE = document.getElementById("video_add_form_video_error");
    var r = this.checkVideoField(file, videoE);
    if(r) {
      this.setState({ videoFieldError: false })
    }else{
      this.setState({ videoFieldError: true })
    }
    this.setState({
      video: file,
      name: file.name,
    });
  };

  render() {
    const {
      camera,
      cameraAngle,
      description,
      video,
      name,
      loading,
      progress,
    } = this.state;
    const { cameras, cameraAngles } = this.props;

    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container} style={{width: '32rem'}}>
          <h4>New Video</h4>

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
                    <option defaultChecked={true}>Select the camera..</option>
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
              <label htmlFor="video_add_form_cameraAngle">CAMERA ANGLE</label>

              {cameraAngles.length > 0 ? (
                <Fragment>
                  <select
                    name="cameraAngle"
                    id="video_add_form_cameraAngle"
                    onChange={this.onChange}
                  >
                    <option value={null} defaultChecked={true}>
                      Select the camera angle..
                    </option>
                    {cameraAngles.map((c, i) => (
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
                id="video_add_form_cameraAngle_error"
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
                error={this.state.videoFieldError}
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
                ADD
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
  cameraAngles: state.cameraAngleReducer.cameraAngles,
});

export default connect(mapStateToProps, {
  getCameras,
  getCameraAngles,
  addVideo,
})(AddVideo);
