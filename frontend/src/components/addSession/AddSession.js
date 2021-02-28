import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./AddSession.module.css";
import BtnSpinner from "../spinners/btn/BtnSpinner";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";

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

  //////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////
  //////////////////////////////////////////////////////////////
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

      try {
        let res = await axios(`http://localhost:8000/api/add-video/`, {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("video uploaded", res.data);
      } catch (err) {
        if (err) console.log(err);
      }
    }
    this.setState({ uploading: false });
    this.props.history.push(`/${this.props.profile.id}`);
  }

  //////////////////////////////////////////////////////////////
  //////////////////////  event listeners //////////////////////
  //////////////////////////////////////////////////////////////
  onDateChangeHandler = (e) => {
    this.setState({
      date: e.target.value,
    });
  };

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
    const { videos, profile } = this.props;

    // if all videos uploaded navigate to ProfilePage
    // if (this.state.allUploaded) {
    //   this.props.history.push("/profile_detail");
    // }

    const sub_links = [
      { name: "Profiles", link: "/" },
      { name: `${profile.name}`, link: `/${profile.id}` },
    ];

    // prepare videos card list
    let video_cards = [];
    for (let i = 0; i < videos.length; i++) {
      const card = (
        <AddVideoCard
          card_id={videos[i] ? videos[i].id : `card_id_${Math.random()}`}
          video={videos[i] ? videos[i] : null}
        />
      );
      video_cards.push(card);
    }

    if (videos.length < 4) {
      const card = <AddVideoCard card_id={Math.random()} video={null} />;
      video_cards.push(card);
    }

    return (
      <div className={classes.container1}>
        <Breadcrumbs
          heading={"New Session"}
          sub_links={sub_links}
          current={"new session"}
        />

        <div className={`container ${classes.container2}`}>
          <form className={classes.form} onSubmit={this.submitSession}>
            <label>Recorded Date</label>
            <input
              type="date"
              name="recorded_date"
              onChange={this.onDateChangeHandler}
            />
            <button type="submit" className={classes.submitbtn}>
              {this.state.uploading ? <BtnSpinner /> : null}
              CONFIRM ALL
            </button>
          </form>

          {this.state.uploading ? (
            <div className={classes.uploading_div}></div>
          ) : null}

          <div className={classes.videoCards}>
            {video_cards.map((card, index) => (
              <div className={classes.videoCard} key={index}>
                {card}
              </div>
            ))}
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
