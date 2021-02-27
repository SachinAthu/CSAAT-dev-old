import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import styles from "./AddProfile.module.css";
import DragDropField from "../../dragDropField/DragDropField";
import BtnSpinner from '../../spinners/btn/BtnSpinner'
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

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onCDocChange = (file) => {
    this.setState({
      consent_doc: file,
      consent_doc_name: file.name,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { clinic_no, name, dob, consent_doc, consent_doc_name } = this.state;
    let sex = "";

    const male = document.getElementById("profile_add_form_m");
    const female = document.getElementById("profile_add_form_f");

    if (male.checked) sex = male.value;
    else sex = female.value;

    // validation
    if(consent_doc.type !== 'application/pdf'){
      alert('PDF files only')
      return
    }

    const formData = new FormData();
    formData.append("clinic_no", clinic_no);
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("sex", sex);
    formData.append("consent_doc", consent_doc);

    let type = ''
    if(consent_doc.type === 'application/pdf') type = 'pdf'
    formData.append("consent_doc_name", `consent_doc_${clinic_no}.${type}`);

    let url = "http://localhost:8000/api/add-profile/";
    let method = "POST";

    if (this.state.editing) {
      url = `http://localhost:8000/api/update-profile/${this.state.id}/`;
      method = "PUT";
    }

    this.setState({requesting: true})

    axios(url, {
      method: method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({requesting: false})
        if (this.state.editing) {
          this.props.updateProfile(res.data);
        } else {
          this.props.addProfile(res.data);
        }
        this.close();
      })
      .catch((err) => {
        this.setState({requesting: false})
        console.log(err)
      });
  };

  close = () => {
    const modal = document.getElementById("profileAddWindow");
    const overlay = document.getElementById("profileAddWindowOverlay");

    modal.classList.add(`${styles.fadeout}`);
    overlay.classList.add(`${styles.overlay_fadeout}`);

    setTimeout(() => {
      this.props.close();
    }, 300);
  };

  resetForm = () => {
    const p = this.props.profile;
    const male = document.getElementById("profile_add_form_m");
    const female = document.getElementById("profile_add_form_f");

    if(p){
      this.setState({
        clinic_no: p.clinic_no ? p.clinic_no : "",
        name: p.name ? p.name : "",
        dob: p.dob ? p.dob : "",
        consent_doc: null,
        consent_doc_name: p.consent_doc_name ? p.consent_doc_name : '',
      });
      if (p.sex.toLowerCase() === "male") {
        male.checked = true;
        female.checked = false;
      } else {
        female.checked = true;
        male.checked = false;
      }
     
    }else{
      this.setState({
        clinic_no: "",
        name: "",
        dob: "",
        consent_doc: null,
        consent_doc_name: '',
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
      <Fragment>
        <div className={styles.container} id="profileAddWindow">
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

          <h4>{editing ? "Edit Profile" : "New Profile"}</h4>

          <form className={styles.form} onSubmit={this.onSubmit}>
            <div className={styles.formgroup}>
              <label htmlFor="profile_add_form_clinic_no">CLINIC NO</label>
              <input
                type="text"
                name="clinic_no"
                id="profile_add_form_clinic_no"
                value={clinic_no}
                onChange={this.onChange}
              />
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="profile_add_form_name">CHILD NAME</label>
              <input
                type="text"
                name="name"
                id="profile_add_form_name"
                value={name}
                onChange={this.onChange}
              />
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="profile_add_form_dob">DATE OF BIRTH</label>
              <input
                type="date"
                name="dob"
                id="profile_add_form_dob"
                value={dob}
                onChange={this.onChange}
              />
            </div>

            <div className={styles.formgroup_radio}>
              <label>GENDER</label>

              <input
                type="radio"
                id="profile_add_form_m"
                name="sex"
                value="Male"
                style={{ marginLeft: 50, marginRight: 8 }}
              />
              <label htmlFor="profile_add_form_m">Male</label>

              <input
                type="radio"
                id="profile_add_form_f"
                name="sex"
                value="Female"
                style={{ marginLeft: 25, marginRight: 8 }}
              />
              <label htmlFor="profile_add_form_f">Female</label>
            </div>

            <div className={styles.formgroup_file}>
              <label>CONSENT DOCUMENT</label>

              <DragDropField
                file={consent_doc}
                filename={consent_doc_name}
                onChange={this.onCDocChange}
              />
            </div>

            <div className={styles.formgroup_btn}>
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
                {requesting ? <BtnSpinner /> : null}
                
                {editing ? "EDIT" : "ADD"}
              </button>
            </div>
          </form>
        </div>

        <div className={styles.overlay} id="profileAddWindowOverlay"></div>
      </Fragment>
    );
  }
}

export default connect(null, { addProfile, updateProfile })(AddProfile);
