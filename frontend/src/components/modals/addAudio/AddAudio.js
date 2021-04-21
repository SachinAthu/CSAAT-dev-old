import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./AddAudio.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import { BASE_URL } from "../../../config";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import DragDropField from "../../layouts/dragDropField/DragDropField";

import { addAudio, updateAudio } from "../../../actions/AudioActions";
import { CHILD_TYPES } from "../../../actions/Types";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddAudio extends Component {
  static propTypes = {
    childType: PropTypes.string.isRequired,
    activeChild: PropTypes.object.isRequired,
    activeSession: PropTypes.object.isRequired,
    addAudio: PropTypes.func.isRequired,
    updateAudio: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      audio: "",
      file_type: "",
      file_extension: "",
      duration: 0,
      editing: false,
      loading: false,
      progress: 0,
      progressBar: false,
    };
    const cancelToken = axios.CancelToken;
    this.cancelTokenSource = cancelToken.source();
  }

  componentDidMount() {
    const a = this.props.audio;
    console.log(a);
    if (a) {
      this.setState({
        editing: true,
        id: a.id ? a.id : "",
        name: a.name ? a.name : "",
        audio: a.audio ? a.audio : "",
        file_type: a.file_type ? a.file_type : "",
        file_extension: a.file_extension ? a.file_extension : "",
        duration: a.duration ? a.duration : "",
      });
    }
  }

  ////////////////////////////////////////////////////////////////////
  /////////////////////////// functions //////////////////////////////
  ////////////////////////////////////////////////////////////////////
  checkFieldEmpty = (inputVal, errorField, errorText) => {
    if (inputVal == null || inputVal === "") {
      this.showError(errorField, errorText);
      return false;
    } else {
      this.removeError(errorField);
      return true;
    }
  };

  checkAudioType = (file, errorField, errorText) => {
    if (!file) return;
    if (
      file.type.toLowerCase() !== "audio/mp3" &&
      file.type.toLowerCase() !== "audio/mpeg"
    ) {
      this.showError(errorField, errorText);
      return false;
    } else {
      this.removeError(errorField);
      return true;
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
    const resSpan = document.getElementById("audio_add_edit_failed");
    resSpan.innerHTML = msg;
  };

  // get the duration of selected audio file
  getDuration = (file) => {
    const audioEl = document.getElementById("audioEl");
    const objectUrl = URL.createObjectURL(file);
    audioEl.setAttribute("src", objectUrl);
    let time;

    audioEl.addEventListener("canplaythrough", function (e) {
      time = Math.round(e.currentTarget.duration);
      URL.revokeObjectURL(objectUrl);
    });

    setTimeout(() => {
      this.setState({ duration: time });
    }, 100);
  };

  // cancel the uploading
  cancelUpload = () => {
    this.cancelTokenSource.cancel("Uploading cancelled!");
  };

  ////////////////////////////////////////////////////////////////////
  /////////////////// event handlers /////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  onSubmitHandler = (e) => {
    e.preventDefault();
    const { id, name, audio, file_extension, file_type, duration } = this.state;
    const errorF = document.getElementById("audio_add_form_audio_error");

    // validate
    var r1 = false;
    var r2 = false;
    r1 = this.checkFieldEmpty(audio, errorF, "Audio file is required");
    if (r1) {
      r2 = this.checkAudioType(audio, errorF, "Invalid audio format");
    }
    if (!r1 || !r2) {
      return;
    }

    this.setState({ loading: true, progressBar: true });

    let url = "";
    let method = "";
    if (this.props.childType === CHILD_TYPES.TYPICAL) {
      if (this.state.editing) {
        url = `${BASE_URL}/update-t-audio/${id}/`;
        method = "PUT";
      } else {
        url = `${BASE_URL}/add-t-audio/`;
        method = "POST";
      }
    } else {
      if (this.state.editing) {
        url = `${BASE_URL}/update-at-audio/${id}/`;
        method = "PUT";
      } else {
        url = `${BASE_URL}/add-at-audio/`;
        method = "POST";
      }
    }

    let formData = new FormData();
    if (this.props.childType === CHILD_TYPES.TYPICAL) {
      formData.append("tChild", this.props.activeChild.id);
    } else {
      formData.append("atChild", this.props.activeChild.id);
    }
    formData.append("session", this.props.activeSession.id);
    formData.append("name", name);
    formData.append("audio", audio);
    formData.append("file_type", audio.type);
    this.getDuration(audio);
    setTimeout(() => {
      formData.append("duration", this.state.duration);

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
          console.log("audio uploaded", res.data);
          if (this.props.video) {
            this.props.updateAudio(res.data);
          } else {
            this.props.addAudio(res.data);
          }

          this.setState({ loading: false, progressBar: false });
          this.props.close();
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
    }, 200);
  };

  onAudioChangeHandler = (file) => {
    console.log(file);
    var errorF = document.getElementById("audio_add_form_audio_error");
    var r = this.checkFieldEmpty(file, errorF, "Audio file is required");
    if (r) {
      this.checkAudioType(file, errorF, "Invalid audio format");
    }

    this.setState({
      audio: file,
      name: file.name,
    });
  };

  resetFormHandler = () => {
    this.setState({
      name: "",
      audio: "",
      file_type: "",
      file_extension: "",
      duration: "",
    });
  };

  render() {
    const { name, audio, editing, loading, progress } = this.state;

    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container}>
          <h4>{editing ? "Edit Audio" : "New Audio"}</h4>

          <form className={classes.form} onSubmit={this.onSubmitHandler}>
            <div className={classes.formgroup}>
              <label>AUDIO FILE</label>

              <DragDropField
                id="audio_add_form_audio"
                file={audio}
                filename={name}
                onChange={this.onAudioChangeHandler}
              />

              <span
                id="audio_add_form_audio_error"
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

            <div className={classes.formgroup_btn}>
              <button
                type="button"
                className={`.button_reset ${classes.resetbtn}`}
                onClick={this.resetFormHandler}
              >
                Reset
              </button>

              <button
                type="submit"
                className={`.button_primary ${classes.submitbtn}`}
              >
                {loading ? <BtnSpinner /> : null}

                {editing ? "EDIT" : "ADD"}
              </button>
            </div>
          </form>

          <span id="audio_add_edit_failed" className={classes.failed}></span>
        </div>

        <audio
          controls
          width="500px"
          id="audioEl"
          style={{ display: "none" }}
        ></audio>
      </ModalFrame>
    );
  }
}

const mapStateToProps = (state) => ({
  childType: state.childReducer.childType,
  activeChild: state.childReducer.activeChild,
  activeSession: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, { addAudio, updateAudio })(AddAudio);
