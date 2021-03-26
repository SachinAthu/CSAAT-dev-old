import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./AddProfile.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import DragDropField from "../../dragDropField/DragDropField";
import BtnSpinner from "../../spinners/btn/BtnSpinner";

import { addProfile, updateProfile } from "../../../actions/ProfileActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class AddProfile extends Component {
  static propTypes = {
    addProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      clinic_no: "",
      name: "",
      dob: "",
      sex: "",
      consent_doc: "",
      consent_doc_name: "",
      editing: false,
      requesting: false,
    };
  }

  componentDidMount() {
    const p = this.props.profile;
    if (p) {
      this.setState({
        editing: true,
        id: p.id,
        clinic_no: p.clinic_no ? p.clinic_no : "",
        name: p.name ? p.name : "",
        dob: p.dob ? p.dob : "",
        consent_doc: null,
        consent_doc_name: null,
      });

      const male = document.getElementById("profile_add_form_m");
      const female = document.getElementById("profile_add_form_f");

      if (p.sex.toLowerCase() == "male") {
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
    if(!file) return
    if(file.type.toLowerCase() !== 'application/pdf'){
      this.showError(errorField, errorText);
      return false;
    }else{
      this.removeError(errorField);
      return true;
    }
  }

  checkAllFields = (clinic_no, name, dob, sex, consent_doc) => {
    const clinic_no_e = document.getElementById('profile_add_form_clinic_no_error')
    const name_e = document.getElementById('profile_add_form_name_error')
    const dob_e = document.getElementById('profile_add_form_dob_error')
    const gender_e = document.getElementById('profile_add_form_gender_error')
    const cdoc_e = document.getElementById('profile_add_form_cdoc_error')

    // clinic_no
    var r1 = this.checkFieldEmpty(clinic_no, clinic_no_e, "Child's clinic number is required");
    var r2
    if(r1){
      r2 = this.checkMaxLength(clinic_no, 50, clinic_no_e, 'Maximum no of characters exceeded')
    }
    
    // name
    var r3 = this.checkFieldEmpty(name, name_e, "Child's name is required");
    var r4
    if(r3){
      r4 = this.checkMaxLength(name, 200, name_e, 'Maximum no of characters exceeded')
    }
    
    // dob
    var r5 = this.checkFieldEmpty(dob, dob_e, "Child's birth date is required");

    // gender
    var r6 = this.checkFieldEmpty(sex, gender_e, "Child's gender is required");

    // cdoc
    var r7 = this.checkCDocType(consent_doc, cdoc_e, 'Document must be a PDF')

    if(r1 && r2 && r3 && r4 && r5 && r6 && r7){
      return true
    }else{
      return false
    }

  }

  showError = (errorField, errorText) => {
    errorField.style.display = "block";
    errorField.innerHTML = errorText;
  };

  removeError = (errorField) => {
    errorField.innerHTML = "";
    errorField.style.display = "none";
  };

  showRes = (r, msg) => {
    const resSpan = document.getElementById("profile_add_edit_result");

    if (r) {
      resSpan.innerHTML = msg;
      resSpan.classList.remove(`${classes.failed}`);
      resSpan.classList.add(`${classes.success}`);
    } else {
      resSpan.innerHTML = msg;
      resSpan.classList.remove(`${classes.success}`);
      resSpan.classList.add(`${classes.failed}`);
    }
  };

  /////////////////////////////////////////////////////////////////////
  ///////////////////////// event listners ////////////////////////////
  /////////////////////////////////////////////////////////////////////
  onChangeHandler = (e) => {
    switch (e.target.name) {
      case "clinic_no":
        var errorField = document.getElementById(
          "profile_add_form_clinic_no_error"
        );
        var r = this.checkFieldEmpty(
          e.target.value,
          errorField,
          "Child's clinic number is required"
        );
        if (r) {
          this.checkMaxLength(
            e.target.value,
            50,
            errorField,
            "Maximum no of characters exceeded"
          );
        }
        break;
      case "name":
        var errorField = document.getElementById("profile_add_form_name_error");
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
        var errorField = document.getElementById("profile_add_form_dob_error");
        this.checkFieldEmpty(
          e.target.value,
          errorField,
          "Child's birth date is required"
        );
        break;
      case "sex":
        var errorField = document.getElementById("profile_add_form_gender_error");
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
    var errorField = document.getElementById("profile_add_form_cdoc_error");
    this.checkCDocType(file, errorField, 'Document must be a PDF')

    this.setState({
      consent_doc: file,
      consent_doc_name: file.name,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();

    const { clinic_no, name, dob, sex, consent_doc } = this.state;
    const male = document.getElementById("profile_add_form_m");
    const female = document.getElementById("profile_add_form_f");

    // validation
    const r = this.checkAllFields(clinic_no, name, dob, sex, consent_doc)
    if (!r) {
      return;
    }

    const formData = new FormData();
    formData.append("clinic_no", clinic_no);
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("sex", sex);
    formData.append("consent_doc", consent_doc);

    let type = "";
    if (consent_doc && consent_doc.type === "application/pdf") type = "pdf";
    formData.append("consent_doc_name", `consent_doc_${clinic_no}.${type}`);

    let url = "http://localhost:8000/api/add-profile/";
    let method = "POST";

    if (this.state.editing) {
      url = `http://localhost:8000/api/update-profile/${this.state.id}/`;
      method = "PUT";
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

        if(method === 'POST'){
          this.showRes(true, 'Profile added!')
        }else{
          this.showRes(true, 'Profile updated!')
        }

        this.setState({ requesting: false });
        if (this.state.editing) {
          this.props.updateProfile(res.data);
        } else {
          this.props.addProfile(res.data);
        }
      })
      .catch((err) => {
        this.setState({ requesting: false });
        console.log(err);
        if(method === 'POST'){
          this.showRes(false, 'Profile adding failed!')
        }else{
          this.showRes(false, 'Profile updating failed!')
        }
      });
  };

  resetFormHandler = () => {
    const p = this.props.profile;
    const male = document.getElementById("profile_add_form_m");
    const female = document.getElementById("profile_add_form_f");

    if (p) {
      this.setState({
        clinic_no: p.clinic_no ? p.clinic_no : "",
        name: p.name ? p.name : "",
        dob: p.dob ? p.dob : "",
        consent_doc: null,
        consent_doc_name: p.consent_doc_name ? p.consent_doc_name : "",
      });
      if (p.sex.toLowerCase() === "male") {
        male.checked = true;
        female.checked = false;
      } else {
        female.checked = true;
        male.checked = false;
      }
    } else {
      this.setState({
        clinic_no: "",
        name: "",
        dob: "",
        consent_doc: null,
        consent_doc_name: "",
      });
      male.checked = false;
      female.checked = false;
    }
  };

  render() {
    const {
      clinic_no,
      name,
      dob,
      consent_doc,
      consent_doc_name,
      editing,
      requesting,
    } = this.state;

    return (
      <ModalFrame close={this.props.close}>
        <div className={classes.container}>
          <h4>{editing ? "Edit Profile" : "New Profile"}</h4>

          <form className={classes.form} onSubmit={this.onSubmitHandler}>
            <div className={classes.formgroup}>
              <label htmlFor="profile_add_form_clinic_no">CLINIC NO</label>
              <input
                type="text"
                name="clinic_no"
                id="profile_add_form_clinic_no"
                value={clinic_no}
                onChange={this.onChangeHandler}
              />
              <span
                id="profile_add_form_clinic_no_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup}>
              <label htmlFor="profile_add_form_name">CHILD NAME</label>
              <input
                type="text"
                name="name"
                id="profile_add_form_name"
                value={name}
                onChange={this.onChangeHandler}
              />
              <span
                id="profile_add_form_name_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup}>
              <label htmlFor="profile_add_form_dob">DATE OF BIRTH</label>
              <input
                type="date"
                name="dob"
                id="profile_add_form_dob"
                value={dob}
                onChange={this.onChangeHandler}
              />
              <span
                id="profile_add_form_dob_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup_radio}>
              <div className={classes.formgroup_radio_1}>
                <label>GENDER</label>

                <input
                  type="radio"
                  id="profile_add_form_m"
                  name="sex"
                  value="male"
                  style={{ marginLeft: 50, marginRight: 8 }}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="profile_add_form_m">Male</label>
                <input
                  type="radio"
                  id="profile_add_form_f"
                  name="sex"
                  value="female"
                  style={{ marginLeft: 25, marginRight: 8 }}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="profile_add_form_f">Female</label>
              </div>

              <span
                id="profile_add_form_gender_error"
                className={classes.fieldError}
              ></span>
            </div>

            <div className={classes.formgroup_file}>
              <label>CONSENT DOCUMENT</label>

              <DragDropField
                file={consent_doc}
                filename={consent_doc_name}
                onChange={this.onCDocChangeHandler}
              />

              <span
                id="profile_add_form_cdoc_error"
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

          <span id="profile_add_edit_result" className={classes.result}></span>
        </div>
      </ModalFrame>
    );
  }
}

export default connect(null, { addProfile, updateProfile })(AddProfile);
