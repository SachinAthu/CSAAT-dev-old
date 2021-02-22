import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import styles from "./AddVideoCard.module.css";
import { deleteVideo } from "../../../actions/VideoActions";
import AddVideo from "./addVideo/AddVideo";
import Player from "../../Player/Player";

class AddVideoCard extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    session: PropTypes.object,
    uploading: PropTypes.bool,
    deleteVideo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adding: false,
    };
  }

  addHandler = () => {
    this.setState({ adding: true });
  };

  editHandler = (video) => {
    console.log(video)
    this.setState({ adding: true });
  };

  removeHandler = (video, video_div_id) => {
    // console.log(video)
    // document.getElementById(video_div_id).innerHTML = '';
    this.props.deleteVideo(video);
  };

  closeAddWindow = () => {
    this.setState({ adding: false });
  };

  // uploadVideo = () => {
  //   if (!this.props.video) return;

  //   this.setState({ uploading: true });

  //   const video = this.props.video;

  //   let formData = new FormData();
  //   formData.append("profile", this.props.profile.id);
  //   formData.append("session", this.props.session.id);
  //   formData.append("camera", video.camera);
  //   formData.append("name", video.name);
  //   formData.append("description", video.description);
  //   formData.append("video", video.video);
  //   formData.append("type", video.type);
  //   formData.append("camera_angle", video.camera_angle);
  //   formData.append("duration", video.duration);

  //   axios(`http://localhost:8000/api/add-video/`, {
  //     method: "POST",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   })
  //     .then((res) => {
  //       console.log("video uploaded", res.data);
  //       this.props.completeUpload();
  //     })
  //     .catch((err) => console.log(err));
  // };

  render() {
    const { adding } = this.state;
    const { video } = this.props;

    let cardContent;
    if (video) {
      const video_div_id = `video_div_${video.id}`;

      cardContent = (
        <div className={styles.card_content}>
          <div id={video_div_id} className={styles.videoplay}>
            <Player
              key={video.video}
              src={video.video}
              play={false}
            />
          </div>

          <div className={styles.info}>
            <div className={styles.info_1}>
              <span className={styles.info_1_1}>{video.name}</span>
              <span className={styles.info_1_2}>{video.duration}</span>
            </div>

            <div className={styles.info_2}>
              <button
                onClick={this.editHandler.bind(this, video)}
                className={styles.editbtn}
              >
                Edit
              </button>

              <button
                onClick={this.removeHandler.bind(this, video, video_div_id)}
                className={styles.removebtn}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      cardContent = (
        <div className={styles.empty}>
          <button onClick={this.addHandler}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Add Video</title>
              <path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {cardContent}

        {adding ? (
          <AddVideo card_id={this.props.card_id} video={this.props.video} close={this.closeAddWindow} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  session: state.sessionReducer.activeSession,
});

export default connect(mapStateToProps, { deleteVideo, withRef: true })(AddVideoCard);
