import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import ModalFrame from "../modalFrame/ModalFrame";
import classes from "../../../assets/css/AddModal.module.css";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import { BASE_URL } from "../../../config";

import { addCameraAngle } from "../../../actions/CameraAngleActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddCameraAngle extends Component {
  static propTypes = {
    addCameraAngle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      requesting: false,
    };
  }

  /////////////////////////////////////////////////////////////////////
  /////////////////////////// functions ///////////////////////////////
  /////////////////////////////////////////////////////////////////////
  checkFieldEmpty = (inputVal, field, errorField, errorText) => {
    if (inputVal == null || inputVal === "") {
      this.showError(field, errorField, errorText);
      return false;
    } else {
      this.removeError(field, errorField);
      return true;
    }
  };

  checkAllFields = (name) => {
    var r1 = false;

    const name_f = document.getElementById("camera_angle_add_form_name");
    const name_e = document.getElementById("camera_angle_add_form_name_error");

    // name
    r1 = this.checkFieldEmpty(
      name,
      name_f,
      name_e,
      "Camera angle name is required"
    );

    if (r1) {
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
    const resSpan = document.getElementById("camera_angle_add_failed");
    resSpan.innerHTML = msg;
  };

  /////////////////////////////////////////////////////////////////////
  ///////////////////////// event listners ////////////////////////////
  /////////////////////////////////////////////////////////////////////
  onChangeHandler = (e) => {
    switch (e.target.name) {
      case "name":
        var field = document.getElementById("camera_angle_add_form_name");
        var errorField = document.getElementById(
          "camera_angle_add_form_name_error"
        );
        var r = this.checkFieldEmpty(
          e.target.value,
          field,
          errorField,
          "Camera angle name is required"
        );
        break;

      default:
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    const { name } = this.state;

    // validation
    const r = this.checkAllFields(name);
    if (!r) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    this.setState({ requesting: true });

    axios(`${BASE_URL}/add-camera-angle/`, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        this.setState({ requesting: false });
        this.props.addCameraAngle(res.data);
        this.props.close();
      })
      .catch((err) => {
        this.setState({ requesting: false });
        this.showFailed("Camera angle adding failed!");
      });
  };

  resetFormHandler = () => {
    this.setState({
      name: "",
    });

    // reset errors
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
  };

  render() {
    const { name, requesting } = this.state;

    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container} style={{ width: "26rem" }}>
          <h4>New Camera Angle</h4>

          <form className={classes.form} onSubmit={this.onSubmitHandler}>
            <div className={classes.formgroup}>
              <label htmlFor="camera_angle_add_form_name">NAME</label>
              <input
                type="text"
                name="name"
                id="camera_angle_add_form_name"
                value={name}
                onChange={this.onChangeHandler}
              />
              <span
                id="camera_angle_add_form_name_error"
                className={classes.fieldError}
              ></span>
            </div>

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
                {requesting ? <BtnSpinner /> : null}
                ADD
              </button>
            </div>
          </form>

          <span id="camera_angle_add_failed" className={classes.failed}></span>
        </div>
      </ModalFrame>
    );
  }
}

export default connect(null, { addCameraAngle })(AddCameraAngle);
