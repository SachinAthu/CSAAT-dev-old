import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./DeleteConfirmPopup.module.css";
import BtnSpinner from "../spinners/btn/BtnSpinner";

import { deleteProfile } from "../../actions/ProfileActions";
import { deleteSession, setActiveSessionFirst } from "../../actions/SessionActions"
import { deleteVideo } from '../../actions/VideoActions'

const DeleteConformPopup = (props) => {
  const [deleting, setDeleting] = useState(false);

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////

  const close = (res) => {
    const modal = document.getElementById("deleteConfirmWindow");
    const overlay = document.getElementById("deleteConfirmWindowOverlay");

    modal.classList.add(`${classes.fadeout}`);
    overlay.classList.add(`${classes.overlay_fadeout}`);

    setTimeout(() => {
      props.close(res);
    }, 300);
  };

  const deleteProfiles = async (profiles = props.data) => {
    setDeleting(true);
    for (let i = 0; i < profiles.length; i++) {
      try {
        let res = await axios.delete(
          `http://localhost:8000/api/delete-profile/${profiles[i].id}`
        );
        console.log(res.data);
        props.deleteProfile(profiles[i].id);
        close(true);
      } catch (err) {
        if (err) console.log('Profile deletion failed', err);
      }
    }

    setDeleting(false);
  };

  const deleteSession = async (sessionId = props.data) => {
    // console.log(props.data)
    setDeleting(true);
    
    try{
      const res = await axios.delete(`http://localhost:8000/api/delete-session/${sessionId}`)
      console.log(res.data);
      
      // delete session from redux store
      props.deleteSession(sessionId);

      // set the active session to first session on the session list
      // props.setActiveSessionFirst()
      close(true);

    }catch(err){
      if(err) console.log('Session deletion failed', err)
    }

    setDeleting(false);
    
  };

  const deleteVideo = async (videoId = props.data) => {
    setDeleting(true)

    try{
      const res = await axios.delete(`http://localhost:8000/api/delete-video/${videoId}`)
      console.log("Video deleted", res.data);
      
      // remove from redux store
      props.deleteVideo(videoId);
      close(true);

    }catch(err){
      if(err) console.log("Video deletion failed", err)
    }
    
    setDeleting(false)

  }

  /////////////////////////////////////////////////////
  ////////////////// event listeners //////////////////
  /////////////////////////////////////////////////////
  const deleteHandler = () => {
    switch (props.header) {
      case "profile":
        deleteProfiles();
        break;
      case "session":
        deleteSession();
        break;
      case "video":
        deleteVideo();
        break;
      default:
        console.log("Invalid switch case input");
    }
  };

  return (
    <Fragment>
      <div className={classes.container} id="deleteConfirmWindow">
        <button onClick={() => close(false)} className={classes.closebtn}>
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

        <div className={classes.header}>
          <h3>Delete {props.header}?</h3>
          <span>
            Are you sure you want to delete this {props.header}
            {props.many ? "s" : null}?
          </span>
          <span>You can't undo this action.</span>
        </div>

        <div className={classes.warning}>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <path d="M16 2.899l13.409 26.726h-26.819l13.409-26.726zM16 0c-0.69 0-1.379 0.465-1.903 1.395l-13.659 27.222c-1.046 1.86-0.156 3.383 1.978 3.383h27.166c2.134 0 3.025-1.522 1.978-3.383h0l-13.659-27.222c-0.523-0.93-1.213-1.395-1.903-1.395v0z"></path>
            <path d="M18 26c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"></path>
            <path d="M16 22c-1.105 0-2-0.895-2-2v-6c0-1.105 0.895-2 2-2s2 0.895 2 2v6c0 1.105-0.895 2-2 2z"></path>
          </svg>

          <div className={classes.warning_2}>
            <span>Warning</span>
            <span>{props.msg}</span>
          </div>
        </div>

        <div className={classes.actions}>
          <button
            type="button"
            className={`.button_reset ${classes.cancelbtn}`}
            onClick={() => close(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`.button_primary ${classes.deletebtn}`}
            onClick={deleteHandler}
          >
            {deleting ? <BtnSpinner /> : null}
            Delete
          </button>
        </div>
      </div>

      <div className={classes.overlay} id="deleteConfirmWindowOverlay"></div>
    </Fragment>
  );
};

DeleteConformPopup.propTypes = {
  deleteProfile: PropTypes.func.isRequired,
  deleteSession: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
  setActiveSessionFirst: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { deleteProfile, deleteSession, deleteVideo, setActiveSessionFirst })(DeleteConformPopup);
