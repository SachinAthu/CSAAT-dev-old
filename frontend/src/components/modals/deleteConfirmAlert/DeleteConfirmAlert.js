import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./DeleteConfirmAlert.module.css";
import BtnSpinner from "../../layouts/spinners/btn/BtnSpinner";
import ModalFrame from "../modalFrame/ModalFrame";
import { BASE_URL } from '../../../config'

import { deleteChild } from "../../../actions/ChildActions";
import {
  deleteSession,
  setActiveSessionFirst,
} from "../../../actions/SessionActions";
import { deleteVideo } from "../../../actions/VideoActions";
import { CHILD_TYPES } from "../../../actions/Types";
import { deleteAudio } from "../../../actions/AudioActions";

const DeleteConformPopup = (props) => {
  const [deleting, setDeleting] = useState(false);
  const [isError, setIsError] = useState(false);

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////
  const deleteChilds = async (profiles = props.data) => {
    setDeleting(true);

    let url = "";
    if (props.childType === CHILD_TYPES.TYPICAL) {
      url = `${BASE_URL}/8000/delete-t-child`;
    } else {
      url = `${BASE_URL}/8000/delete-at-child`;
    }

    for (let i = 0; i < profiles.length; i++) {
      try {
        let res = await axios.delete(`${url}/${profiles[i].id}`);
        console.log(res.data);
        props.deleteChild(profiles[i].id);
        setIsError(false)

      } catch (err) {
        if (err) {
          console.log("Profile deletion failed", err);
          setDeleting(true)
          setIsError(true)
        } 
      }
    }
    
    setDeleting(false);
    setTimeout(() => {
      props.close();
    }, 2000);
  };

  const deleteSession = async (sessionId = props.data) => {
    // console.log(props.data)
    setDeleting(true);

    try {
      const res = await axios.delete(
        `${BASE_URL}/delete-session/${sessionId}`
      );
      console.log(res.data);
      setDeleting(false);
      setIsError(false)

      // delete session from redux store
      props.deleteSession(sessionId);

      // showRes(true, "Session record deleted!");
      // set the active session to first session on the session list
      // props.setActiveSessionFirst()
    } catch (err) {
      if (err){
        console.log("Session deletion failed", err);
        setIsError(true)
      } 
    }
    
    setDeleting(false);
    setTimeout(() => {
      props.close();
    }, 2000);
  };

  const deleteVideo = async (videoId = props.data) => {
    setDeleting(true);

    try {
      const res = await axios.delete(
        `${BASE_URL}/delete-video/${videoId}`
      );
      console.log("Video deleted", res.data);
        setIsError(false)

      // remove from redux store
      props.deleteVideo(videoId);

    } catch (err) {
      if (err) {
        console.log("Video deletion failed", err);
        setIsError(true)
      }
    }
    
    setDeleting(false);
    setTimeout(() => {
      props.close();
    }, 2000);

  };

  const deleteAudio = async (audioId = props.data) => {
    setDeleting(true);

    try {
      const res = await axios.delete(
        `${BASE_URL}/delete-audio/${audioId}/`
      );
      console.log("Audio deleted", res.data);
        setIsError(false)

      // remove from redux store
      props.deleteAudio(audioId);

    } catch (err) {
      if (err) {
        console.log("Audio deletion failed", err);
        setIsError(true)
      }
    }
    
    setDeleting(false);
    setTimeout(() => {
      props.close();
    }, 2000);

  };


  /////////////////////////////////////////////////////
  ////////////////// event listeners //////////////////
  /////////////////////////////////////////////////////
  const deleteHandler = () => {
    switch (props.type) {
      case "child":
        deleteChilds();
        break;
      case "session":
        deleteSession();
        break;
      case "video":
        deleteVideo();
      case "audio":
        deleteAudio();
        break;
      default:
        console.log("Invalid switch case input");
    }
  };

  return (
    <ModalFrame close={props.close}>
      <div className={classes.container} id="deleteConfirmWindow">
        <div className={classes.header}>
          <h3>Delete ?</h3>
          <span>
            Are you sure you want to delete this {props.header}
            {props.many ? "s" : null}? You can't undo this action.
          </span>
        </div>

        <div className={classes.actions}>
          <button
            type="button"
            className={`.button_primary ${classes.deletebtn}`}
            onClick={deleteHandler}
          >
            {deleting ? <BtnSpinner /> : null}
            Delete
          </button>

          <button
            type="button"
            className={`.button_reset ${classes.cancelbtn}`}
            onClick={() => props.close()}
          >
            Cancel
          </button>
        </div>

        {isError ? <span id="delete_result" className={classes.result}>Deletion failed!</span> : null }
      </div>
    </ModalFrame>
  );
};

DeleteConformPopup.propTypes = {
  childType: PropTypes.string.isRequired,
  deleteChild: PropTypes.func.isRequired,
  deleteSession: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
  setActiveSessionFirst: PropTypes.func.isRequired,
  deleteAudio: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  childType: state.childReducer.childType,
});

export default connect(mapStateToProps, {
  deleteChild,
  deleteSession,
  deleteVideo,
  setActiveSessionFirst,
  deleteAudio,
})(DeleteConformPopup);
