import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./AddChild.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import DragDropField from "../../layouts/dragDropField/DragDropField";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";

import { addChild, updateChild } from "../../../actions/ChildActions";
import { CHILD_TYPES } from "../../../actions/Types";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AddChild extends Component {
  static propTypes = {
    addChild: PropTypes.func.isRequired,
    childType: PropTypes.string.isRequired,
    updateChild: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      clinic_no: "",
      unique_no: "",
      sequence_no: "",
      name: "",
      dob: "",
      gender: "",
      cdoc: "",
      cdoc_name: "",
      dgform: "",
      dgform_name: "",
      editing: false,
      requesting: false,
    };
  }

  componentDidMount() {
    const c = this.props.child;
    console.log(c);
    if (c) {
      if (this.props.childType === CHILD_TYPES.TYPICAL) {
        this.setState({
          editing: true,
          id: c.id,
          unique_no: c.unique_no ? c.unique_no : "",
          sequence_no: c.sequence_no ? c.sequence_no : "",
          name: c.name ? c.name : "",
          dob: c.dob ? c.dob : "",
          gender: c.gender ? c.gender : "",
          cdoc: null,
          cdoc_name: c.cdoc_name ? c.cdoc_name : "",
          dgform: null,
          dgform_name: c.dgform_name ? c.dgform_name : "",
        });
      } else {
        this.setState({
          editing: true,
          id: c.id,
          clinic_no: c.clinic_no ? c.clinic_no : "",
          name: c.name ? c.name : "",
          dob: c.dob ? c.dob : "",
          gender: c.gender ? c.gender : "",
          cdoc: null,
          cdoc_name: c.cdoc_name ? c.cdoc_name : "",
          dgform: null,
          dgform_name: c.dgform_name ? c.dgform_name : "",
        });
      }

      const male = document.getElementById("child_add_form_m");
      const female = document.getElementById("child_add_form_f");

      if (c.gender.toLowerCase() == "male") {
        male.checked = true;
      } else {
        female.checked = true;
      }
    }
  }

  /////////////////////////////////////////////////////////////////////
  /////////////////////////// functions ///////////////////////////////
  /////////////////////////////////////////////////////////////////////
  checkFieldEmpty = (inputVal, errorField, errorText) => {
    if (inputVal == null || inputVal === "") {
      this.showError(errorField, errorText);
      return false;
    } else {
      this.removeError(errorField);
      return true;
    }
  };

  checkMaxLength = (inputVal, maxLength, errorField, errorText) => {
    if (inputVal.toString().length > maxLength) {
      this.showError(errorField, errorText);
      return false;
    } else {
      this.removeError(errorField);
      return true;
    }
  };

  checkCDocType = (file, errorField, errorText) => {
    if (!file) return;
    if (file.type.toLowerCase() !== "application/pdf") {
      this.showError(errorField, errorText);
      return false;
    } else {
      this.removeError(errorField);
      return true;
    }
  };

  checkAllFields = (unique_no, sequence_no, clinic_no, name, dob, gender, cdoc, dgform) => {
    var r1 = false,
        r2 = false,
        r3 = false,
        r4 = false,
        r5 = false,
        r6 = false,
        r7 = false,
        r8 = false,
        r9 = false,
        r10 = false,
        r11 = false,
        r12 = false

    if(this.props.childType === CHILD_TYPES.TYPICAL){
      // unique_no
      const unique_no_e = document.getElementById(
        "child_add_form_unique_no_error"
      );

      r1 = this.checkFieldEmpty(
        unique_no,
        unique_no_e,
        "Child's unique number is required"
      );
      if (r1) {
        r2 = this.checkMaxLength(
          unique_no,
          20,
          unique_no_e,
          "Maximum no of characters exceeded"
        );
      }

      // sequence_no
      const sequence_no_e = document.getElementById(
        "child_add_form_sequence_no_error"
      );
      r3 = this.checkFieldEmpty(
        sequence_no,
        sequence_no_e,
        "Child's sequence number is required"
      );
      if (r3) {
        r4 = this.checkMaxLength(
          sequence_no,
          20,
          sequence_no_e,
          "Maximum no of characters exceeded"
        );
      }

    }else{
      // clinic_no
      const clinic_no_e = document.getElementById(
        "child_add_form_clinic_no_error"
      );
      r5 = this.checkFieldEmpty(
        clinic_no,
        clinic_no_e,
        "Child's clinic number is required"
      );
      if (r5) {
        r6 = this.checkMaxLength(
          clinic_no,
          20,
          clinic_no_e,
          "Maximum no of characters exceeded"
        );
      }

    }

    const name_e = document.getElementById("child_add_form_name_error");
    const dob_e = document.getElementById("child_add_form_dob_error");
    const gender_e = document.getElementById("child_add_form_gender_error");
    const cdoc_e = document.getElementById("child_add_form_cdoc_error");
    const dgform_e = document.getElementById("child_add_form_dgform_error");

    // name
    r7 = this.checkFieldEmpty(name, name_e, "Child's name is required");
    if (r7) {
      r8 = this.checkMaxLength(
        name,
        200,
        name_e,
        "Maximum no of characters exceeded"
      );
    }

    // dob
    r9 = this.checkFieldEmpty(dob, dob_e, "Child's birth date is required");

    // gender
    r10 = this.checkFieldEmpty(
      gender,
      gender_e,
      "Child's gender is required"
    );

    // cdoc
    r11 = this.checkCDocType(cdoc, cdoc_e, "Document must be a PDF");

    // dgform
    r12 = this.checkCDocType(dgform, dgform_e, "Document must be a PDF");

    if(this.props.childType === CHILD_TYPES.TYPICAL){
      if (r1 && r2 && r3 && r4 && r7 && r8 && r9 && r10 && r11 && r10) {
        return true;
      } else {
        return false;
      }
    }else{
      if (r5 && r6 && r7 && r8 && r9 && r10 && r11 && r10) {
        return true;
      } else {
        return false;
      }
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
    const resSpan = document.getElementById("child_add_edit_failed");
    resSpan.innerHTML = msg;
  };

  /////////////////////////////////////////////////////////////////////
  ///////////////////////// event listners ////////////////////////////
  /////////////////////////////////////////////////////////////////////
  onChangeHandler = (e) => {
    switch (e.target.name) {
      case "unique_no":
        if(this.props.childType === CHILD_TYPES.TYPICAL){
          var errorField = document.getElementById(
            "child_add_form_unique_no_error"
          );
          var r = this.checkFieldEmpty(
            e.target.value,
            errorField,
            "Child's unique number is required"
          );
          if (r) {
            this.checkMaxLength(
              e.target.value,
              20,
              errorField,
              "Maximum no of characters exceeded"
            );
          }
        }
        break;

      case "sequence_no":
        if(this.props.childType === CHILD_TYPES.TYPICAL){
          var errorField = document.getElementById(
            "child_add_form_sequence_no_error"
          );
          var r = this.checkFieldEmpty(
            e.target.value,
            errorField,
            "Child's sequence number is required"
          );
          if (r) {
            this.checkMaxLength(
              e.target.value,
              20,
              errorField,
              "Maximum no of characters exceeded"
            );
          }
        }
        break;

      case "clinic_no":
        if(this.props.childType === CHILD_TYPES.ANTYPICAL){
          var errorField = document.getElementById(
            "child_add_form_clinic_no_error"
          );
          var r = this.checkFieldEmpty(
            e.target.value,
            errorField,
            "Child's clinic number is required"
          );
          if (r) {
            this.checkMaxLength(
              e.target.value,
              20,
              errorField,
              "Maximum no of characters exceeded"
            );
          }
        }
        break;

      case "name":
        var errorField = document.getElementById("child_add_form_name_error");
        var r = this.checkFieldEmpty(
          e.target.value,
          errorField,
          "Child's name is required"
        );
        if (r) {
          this.checkMaxLength(
            e.target.value,
            200,
            errorField,
            "Maximum no of characters exceeded"
          );
        }
        break;

      case "dob":
        var errorField = document.getElementById("child_add_form_dob_error");
        this.checkFieldEmpty(
          e.target.value,
          errorField,
          "Child's birth date is required"
        );
        break;

      case "gender":
        var errorField = document.getElementById("child_add_form_gender_error");
        this.checkFieldEmpty(
          e.target.value,
          errorField,
          "Child's gender is required"
        );
        break;

      default:
        return;
    }

    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onCDocChangeHandler = (file) => {
    var errorField = document.getElementById("child_add_form_cdoc_error");
    this.checkCDocType(file, errorField, "Document must be a PDF");

    this.setState({
      cdoc: file,
      cdoc_name: file.name,
    });
  };

  onDGFormChangeHandler = (file) => {
    var errorField = document.getElementById("child_add_form_dgform_error");
    this.checkCDocType(file, errorField, "Document must be a PDF");

    this.setState({
      dgform: file,
      dgform_name: file.name,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    const {
      unique_no,
      sequence_no,
      clinic_no,
      name,
      dob,
      gender,
      cdoc,
      cdoc_name,
      dgform,
      dgform_name,
    } = this.state;
    const male = document.getElementById("child_add_form_m");
    const female = document.getElementById("child_add_form_f");

    // validation
    const r = this.checkAllFields(unique_no, sequence_no, clinic_no, name, dob, gender, cdoc, dgform);
    if (!r) {
      return;
    }

    const formData = new FormData();
    if (this.props.childType === CHILD_TYPES.TYPICAL) {
      formData.append("unique_no", unique_no);
      formData.append("sequence_no", sequence_no);
    } else {
      formData.append("clinic_no", clinic_no);
    }
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("gender", gender);

    if (cdoc) {
      formData.append("cdoc", cdoc);
    } else {
      formData.append("cdoc", null);
      formData.append("cdoc_name", null);
    }

    if (dgform) {
      formData.append("dgform", dgform);
    } else {
      formData.append("dgform", null);
      formData.append("dgform_name", null);
    }

    let url = "";
    let method = "";

    if(this.props.childType === CHILD_TYPES.TYPICAL){
      if (this.state.editing) {
        url = `http://localhost:8000/api/update-t-child/${this.state.id}/`;
        method = "PUT";
      }else{
        url = "http://localhost:8000/api/add-t-child/";
        method = "POST";
      }
    }else{
      if (this.state.editing) {
        url = `http://localhost:8000/api/update-at-child/${this.state.id}/`;
        method = "PUT";
      }else{
        url = "http://localhost:8000/api/add-at-child/";
        method = "POST";
      }
    }

    this.setState({ requesting: true });

    axios(url, {
      method: method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);

        this.setState({ requesting: false });
        if (this.state.editing) {
          this.props.updateChild(res.data);
        } else {
          this.props.addChild(res.data);
        }
      })
      .catch((err) => {
        this.setState({ requesting: false });
        console.log(err);
        if (method === "POST") {
          this.showFailed("Child adding failed!");
        } else {
          this.showFailed("Child updating failed!");
        }
      });
  };

  resetFormHandler = () => {
    const c = this.props.child;
    const male = document.getElementById("child_add_form_m");
    const female = document.getElementById("child_add_form_f");

    if (c) {
      this.setState({
        id: c.id ? c.id : "",
        unique_no: c.unique_no ? c.unique_no : "",
        sequence_no: c.sequence_no ? c.sequence_no : "",
        clinic_no: c.clinic_no ? c.clinic_no : "",
        name: c.name ? c.name : "",
        dob: c.dob ? c.dob : "",
        cdoc: null,
        cdoc_name: c.cdoc_name ? c.cdoc_name : "",
        dgform: null,
        dgform_name: c.dgform_name ? c.dgform_name : "",
      });
      if (c.gender.toLowerCase() === "male") {
        male.checked = true;
        female.checked = false;
      } else {
        female.checked = true;
        male.checked = false;
      }
    } else {
      this.setState({
        id: "",
        clinic_no: "",
        unique_no: "",
        sequence_no: "",
        name: "",
        dob: "",
        gender: "",
        cdoc: "",
        cdoc_name: "",
        dgform: "",
        dgform_name: "",
      });
      male.checked = false;
      female.checked = false;
    }
  };

  render() {
    const {
      unique_no,
      sequence_no,
      clinic_no,
      name,
      dob,
      cdoc,
      cdoc_name,
      dgform,
      dgform_name,
      editing,
      requesting,
    } = this.state;

    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container}>
          <h4>{editing ? "Edit Child" : "New Child"}</h4>

          <form className={classes.form} onSubmit={this.onSubmitHandler}>
            {this.props.childType === CHILD_TYPES.TYPICAL ? (
              <div className={classes.formgroup}>
                <label htmlFor="child_add_form_unique_no">UNIQUE NO</label>
                <input
                  type="text"
                  name="unique_no"
                  id="child_add_form_unique_no"
                  value={unique_no}
                  onChange={this.onChangeHandler}
                />
                <span
                  id="child_add_form_unique_no_error"
                  className={classes.fieldError}
                ></span>
              </div>
            ) : null}

            {this.props.childType === CHILD_TYPES.TYPICAL ? (
              <div className={classes.formgroup}>
                <label htmlFor="child_add_form_sequence_no">SEQUENCE NO</label>
                <input
                  type="text"
                  name="sequence_no"
                  id="child_add_form_sequence_no"
                  value={sequence_no}
                  onChange={this.onChangeHandler}
                />
                <span
                  id="child_add_form_sequence_no_error"
                  className={classes.fieldError}
                ></span>
              </div>
            ) : null}

            {this.props.childType === CHILD_TYPES.ANTYPICAL ? (
              <div className={classes.formgroup}>
                <label htmlFor="child_add_form_clinic_no">CLINIC NO</label>
                <input
                  type="text"
                  name="clinic_no"
                  id="child_add_form_clinic_no"
                  value={clinic_no}
                  onChange={this.onChangeHandler}
                />
                <span
                  id="child_add_form_clinic_no_error"
                  className={classes.fieldError}
                ></span>
              </div>
            ) : null}

            <div className={classes.formgroup}>
              <label htmlFor="child_add_form_name">CHILD NAME</label>
              <input
                type="text"
                name="name"
                id="child_add_form_name"
                value={name}
                onChange={this.onChangeHandler}
              />
              <span
                id="child_add_form_name_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup}>
              <label htmlFor="child_add_form_dob">DATE OF BIRTH</label>
              <input
                type="date"
                name="dob"
                id="child_add_form_dob"
                value={dob}
                onChange={this.onChangeHandler}
              />
              <span
                id="child_add_form_dob_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup_radio}>
              <div className={classes.formgroup_radio_1}>
                <label>GENDER</label>

                <input
                  type="radio"
                  id="child_add_form_m"
                  name="gender"
                  value="male"
                  style={{ marginLeft: 50, marginRight: 8 }}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="child_add_form_m">Male</label>
                <input
                  type="radio"
                  id="child_add_form_f"
                  name="gender"
                  value="female"
                  style={{ marginLeft: 25, marginRight: 8 }}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="child_add_form_f">Female</label>
              </div>

              <span
                id="child_add_form_gender_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup_file}>
              <label>CONSENT DOCUMENT</label>

              <DragDropField
                id="profile_add_form_cdoc"
                file={cdoc}
                filename={cdoc_name}
                onChange={this.onCDocChangeHandler}
              />

              <span
                id="child_add_form_cdoc_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup_file}>
              <label>DATA GATHERING FORM</label>

              <DragDropField
                id="profile_add_form_dgform"
                file={dgform}
                filename={dgform_name}
                onChange={this.onDGFormChangeHandler}
              />

              <span
                id="child_add_form_dgform_error"
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

                {editing ? "EDIT" : "ADD"}
              </button>
            </div>
          </form>

          <span id="child_add_edit_failed" className={classes.failed}></span>
        </div>
      </ModalFrame>
    );
  }
}

const mapStateToProps = (state) => ({
  childType: state.childReducer.childType,
});

export default connect(mapStateToProps, { addChild, updateChild })(AddChild);
