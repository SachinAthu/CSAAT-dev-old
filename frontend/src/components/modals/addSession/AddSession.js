import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./AddSession.module.css";
import ModalFrame from "../modalFrame/ModalFrame";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";

import { addSession, setActiveSession } from "../../../actions/SessionActions";
import { deleteVideos } from "../../../actions/VideoActions";
import { CHILD_TYPES } from '../../../actions/Types'

function AddSession(props) {
  const [rDate, setRDate] = useState("");
  const [loading, setLoading] = useState(false);

  //////////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////////
  //////////////////////////////////////////////////////////////////
  const checkFieldEmpty = (inputVal, errorField, errorText) => {
    if (inputVal == null || inputVal === "") {
      showError(errorField, errorText);
      return false;
    } else {
      removeError(errorField);
      return true;
    }
  };

  const showError = (errorField, errorText) => {
    errorField.style.display = "block";
    errorField.innerHTML = errorText;
  };

  const removeError = (errorField) => {
    errorField.innerHTML = "";
    errorField.style.display = "none";
  };

  const showFailed = () => {
    const resSpan = document.getElementById("session_add_failed");
    resSpan.innerHTML = "Session creation failed!";
  };

  //////////////////////////////////////////////////////////////////
  ////////////////////// event handlers ////////////////////////////
  //////////////////////////////////////////////////////////////////
  const onChangeHandler = (e) => {
    // console.log(e.target.value)
    // validation
    const rDate_error = document.getElementById("rDate_error");

    checkFieldEmpty(e.target.value, rDate_error, "Recorded date is required");
    setRDate(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // validation
    const rDate_error = document.getElementById("rDate_error");
    const r = checkFieldEmpty(rDate, rDate_error, "Recorded date is required");

    if (!r) return;

    setLoading(true);

    // create a new session and set created session as the active session
    let url = ""
    if(props.childType === CHILD_TYPES.TYPICAL){
      url = "http://localhost:8000/api/add-t-session/"
    }else{
      url = "http://localhost:8000/api/add-at-session/"
    }

    axios(url, {
      method: "POST",
      data: {
        date: rDate,
        child: props.activeChild.id,
        user: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("session created", res.data);
        setLoading(false);
        props.addSession(res.data);
        props.setActiveSession(res.data);

        // clear redux videos
        props.deleteVideos();

        // display message session created

        // navigate to add session component
        // props.history.push({
        //   pathname: `/${props.profile.id}/${res.data.id}`,
        //   state: { isNew: true },
        // });
      })
      .catch((err) => {
        console.log(err);
        showFailed()
      });

    setLoading(false);
  };

  return (
    <ModalFrame close={props.close}>
      <div className={classes.container}>
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

          <div className={classes.formgroup2}>
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

const mapStateToProps = (state) => ({
  activeChild: state.childReducer.activeChild,
  childType: state.childReducer.childType,
});

export default connect(mapStateToProps, {
  addSession,
  setActiveSession,
  deleteVideos,
})(AddSession);
