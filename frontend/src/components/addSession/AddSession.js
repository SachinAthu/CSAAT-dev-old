import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import styles from "./AddSession.module.css";
import BtnSpinner from "../spinners/btn/BtnSpinner";

import AddVideoCard from "./AddVideoCard/AddVideoCard";
import {
  addSession,
  setActiveSession,
  updateSession,
} from "../../actions/SessionActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddSession extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    session: PropTypes.object,
    videos: PropTypes.array,
    addSession: PropTypes.func.isRequired,
    setActiveSession: PropTypes.func.isRequired,
    updateSession: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: "",
      uploading: false,
      uploadedVideoCount: 0,
      allUploaded: false,
    };
  }

  onDateChange = (e) => {
    this.setState({
      date: e.target.value,
    });
  };

  submitSession = (e) => {
    e.preventDefault();

    if (this.state.date == "") {
      alert("Uploaded date is required!");
      return;
    }

    this.setState({ uploading: true });

    ////// add ///////
    // create the session
    axios(`http://localhost:8000/api/add-session/`, {
      method: "POST",
      data: {
        date: this.state.date,
        profile: this.props.profile.id,
        user: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("session created", res.data);
        this.setState({ uploading: false });
        this.props.addSession(res.data);
        this.props.setActiveSession(res.data);

        // upload videos
        this.uploadeVideos();
      })
      .catch((err) => console.log(err));
  };

  async uploadeVideos() {
    const vids = this.props.videos;

    for (let i = 0; i < this.props.videos.length; i++) {
      let formData = new FormData();
      formData.append("profile", this.props.profile.id);
      formData.append("session", this.props.session.id);
      formData.append("camera", vids[i].camera);
      formData.append("name", vids[i].name);
      formData.append("description", vids[i].description);
      formData.append("video", vids[i].video);
      formData.append("type", vids[i].type);
      formData.append("camera_angle", vids[i].camera_angle);
      formData.append("duration", vids[i].duration);

      try{
        let res = await axios(`http://localhost:8000/api/add-video/`, {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        console.log("video uploaded", res.data);
      }catch(err){
        console.log(err)
      }
    }
    this.setState({ uploading: false });
    this.props.history.push("/");
  }

  // completeUpload = () => {
  //   const count = this.state.uploadedVideoCount;
  //   if (count < this.props.videos.length) {
  //     this.setState({ uploadedVideoCount: count + 1 });
  //   } else {
  //     this.setState({ uploading: false });
  //     setTimeout(() => {
  //       this.setState({ allUploaded: true });
  //     }, 1000);
  //   }
  // };

  render() {
    const { videos } = this.props;

    // if all videos uploaded navigate to ProfilePage
    // if (this.state.allUploaded) {
    //   this.props.history.push("/profile_detail");
    // }

    return (
      <div className={styles.container}>
        <h3>New Session</h3>

        <form className={styles.form} onSubmit={this.submitSession}>
          <label>Recorded Date</label>
          <input
            type="date"
            name="recorded_date"
            onChange={this.onDateChange}
          />
          <button type="submit" className={styles.submitbtn}>
            {this.state.uploading ? <BtnSpinner /> : null}
            CONFIRM ALL
          </button>
        </form>

        {this.state.uploading ? (
          <div className={styles.uploading_div}></div>
        ) : null}

        <div className={styles.videoCards}>
          <div className={styles.videoCard}>
            <AddVideoCard
              card_id={videos[0] ? videos[0].id : `card_id_${Math.random()}`}
              video={videos[0] ? videos[0] : null}
              completeUpload={this.completeUpload}
            />
          </div>

          <div className={styles.videoCard}>
            <AddVideoCard
              card_id={videos[1] ? videos[1].id : `card_id_${Math.random()}`}
              video={videos[1] ? videos[1] : null}
              completeUpload={this.completeUpload}
            />
          </div>

          <div className={styles.videoCard}>
            <AddVideoCard
              card_id={videos[2] ? videos[2].id : `card_id_${Math.random()}`}
              video={videos[2] ? videos[2] : null}
              completeUpload={this.completeUpload}
            />
          </div>

          <div className={styles.videoCard}>
            <AddVideoCard
              card_id={videos[3] ? videos[3].id : `card_id_${Math.random()}`}
              video={videos[3] ? videos[3] : null}
              completeUpload={this.completeUpload}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  session: state.sessionReducer.activeSession,
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, {
  addSession,
  setActiveSession,
  updateSession,
  withRef: true,
})(AddSession);
