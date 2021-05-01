import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "../../../assets/css/AddModal.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import { BASE_URL } from '../../../config'

import { addSession, setActiveSession } from "../../../actions/SessionActions";
import { deleteVideos } from "../../../actions/VideoActions";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
} from "../../../actions/Types";

function AddSession(props) {
  const [rDate, setRDate] = useState("");
  const [loading, setLoading] = useState(false);
  const childType = localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE);
  const activeChild = localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD);

  //////////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////////
  //////////////////////////////////////////////////////////////////
  const checkFieldEmpty = (inputVal, field, errorField, errorText) => {
    if (inputVal == null || inputVal === "") {
      showError(field, errorField, errorText);
      return false;
    } else {
      removeError(field, errorField);
      return true;
    }
  };

  const showError = (field, errorField, errorText) => {
    errorField.style.display = "block";
    errorField.innerHTML = errorText;
    field.classList.add(`${classes.errorBorder}`)
  };

  const removeError = (field, errorField) => {
    errorField.innerHTML = "";
    errorField.style.display = "none";
    field.classList.remove(`${classes.errorBorder}`)
  };

  const showFailed = () => {
    const resSpan = document.getElementById("session_add_failed");
    resSpan.innerHTML = "Session creation failed!";
  };

  //////////////////////////////////////////////////////////////////
  ////////////////////// event handlers ////////////////////////////
  //////////////////////////////////////////////////////////////////
  const onChangeHandler = (e) => {
    // validation
    const rDate_f = document.getElementById("session_add_form_date");
    const rDate_e = document.getElementById("rDate_error");

    checkFieldEmpty(e.target.value, rDate_f, rDate_e, "Recorded date is required");
    setRDate(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // validation
    const rDate_f = document.getElementById("session_add_form_date");
    const rDate_e = document.getElementById("rDate_error");
    const r = checkFieldEmpty(rDate, rDate_f, rDate_e, "Recorded date is required");

    if (!r) return;

    setLoading(true);

    // create a new session and set created session as the active session
    let url = "";
    if (childType === CHILD_TYPES.TYPICAL) {
      url = `${BASE_URL}/add-t-session/`;
    } else {
      url = `${BASE_URL}/add-at-session/`;
    }

    axios(url, {
      method: "POST",
      data: {
        date: rDate,
        child: activeChild,
        user: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(false);
        props.addSession(res.data);
        props.setActiveSession(res.data);
        localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION, res.data.id);

        // clear redux videos
        props.deleteVideos();
        props.close();
      })
      .catch((err) => {
        showFailed();
      });

    setLoading(false);
  };

  const resetFormHandler = () => {
    setRDate('')
     // reset errors
     const errorFields = document.getElementsByClassName(`${classes.fieldError}`)
     for(let i = 0; i < errorFields.length; i++) {
       errorFields[i].innerHTML = "";
       errorFields[i].style.display = "none";
     }
     const formGroups = document.getElementsByClassName(`${classes.formgroup}`)
     for(let i = 0; i < formGroups.length; i++) {
       formGroups[i].children[1].classList.remove(`${classes.errorBorder}`)
     }
  }

  return (
    <ModalFrame close={props.close}>
      <div className={classes.container} style={{width: '22rem'}}>
        <h4>New Session</h4>

        <form className={classes.form} onSubmit={onSubmit.bind(this)}>
          <div className={classes.formgroup}>
            <label htmlFor="session_add_form_date">Recorded Date</label>

            <input
              type="date"
              name="rDate"
              id="session_add_form_date"
              value={rDate}
              onChange={onChangeHandler}
            />

            <span id="rDate_error" className={classes.fieldError}></span>
          </div>

          <div className={classes.formgroup_btn}>
            <button
              type="button"
              className={`.button_reset ${classes.resetbtn}`}
              onClick={resetFormHandler}
            >
              Reset
            </button>

            <button
              type="submit"
              className={`.button_primary ${classes.submitbtn}`}
            >
              {loading ? <BtnSpinner /> : null}
              {"ADD"}
            </button>
          </div>
        </form>

        <span id="session_add_failed" className={classes.failed}></span>
      </div>
    </ModalFrame>
  );
}

AddSession.propTypes = {
  addSession: PropTypes.func.isRequired,
  setActiveSession: PropTypes.func.isRequired,
  deleteVideos: PropTypes.func.isRequired,
};

export default connect(null, {
  addSession,
  setActiveSession,
  deleteVideos,
})(AddSession);
