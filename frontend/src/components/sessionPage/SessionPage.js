import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./SessionPage.module.css";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import SessionVideoCard from "./sessionVideoCard/SessionVideoCard";
import SessionAudioCard from "./sessionAudioCard/SessionAudioCard";
import { BASE_URL } from "../../config";
import ErrorBoundry from '../ErrorBoundry'

import {
  updateSession,
  updateActiveSession,
} from "../../actions/SessionActions";
import { getVideos } from "../../actions/VideoActions";
import { getAudio } from "../../actions/AudioActions";
import { setNav } from "../../actions/NavigationActions";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
  NAV_LINKS,
  CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
} from "../../actions/Types";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class SessionPage extends Component {
  static propTypes = {
    videos: PropTypes.array,
    audio: PropTypes.object,
    updateSession: PropTypes.func.isRequired,
    updateActiveSession: PropTypes.func.isRequired,
    getVideos: PropTypes.func.isRequired,
    getAudio: PropTypes.func.isRequired,
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: "",
      uploadedVideoCount: 0,
      allUploaded: false,
    };
  }

  componentDidMount() {
    // set navigation link
    if(localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE) === CHILD_TYPES.TYPICAL) {
      this.props.setNav(NAV_LINKS.NAV_TYPICAL_CHILD);
      localStorage.setItem(
        CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
        NAV_LINKS.NAV_TYPICAL_CHILD
      );
    }else{
      this.props.setNav(NAV_LINKS.NAV_ATPICAL_CHILD);
      localStorage.setItem(
        CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
        NAV_LINKS.NAV_ATPICAL_CHILD
      );
    }

    this.getActiveSession();
    this.fetchVideos();
    this.fetchAudio();
  }

  //////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////
  //////////////////////////////////////////////////////////////
  getActiveSession = () => {
    axios
      .get(
        `${BASE_URL}/session/${localStorage.getItem(
          CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION
        )}/`
      )
      .then((res) => {
        this.setState({ date: res.data.date });
      })
      .catch((err) => {});
  };

  fetchVideos = () => {
    axios
      .get(
        `${BASE_URL}/videos/${localStorage.getItem(
          CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION
        )}/`
      )
      .then((res) => {
        this.props.getVideos(res.data);
      })
      .catch((err) => {});
  };

  fetchAudio = () => {
    axios
      .get(
        `${BASE_URL}/audio/${localStorage.getItem(
          CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION
        )}/`
      )
      .then((res) => {
        this.props.getAudio(res.data[0]);
      })
      .catch((err) => {});
  };

  //////////////////////////////////////////////////////////////
  //////////////////////  event listeners //////////////////////
  //////////////////////////////////////////////////////////////
  // trigger when uploaded date field value changes and update uploaded date immediatly
  onDateChangeHandler = (e) => {
    this.setState({ date: e.target.value });
    if (e.target.value === "") return;

    // update the session date
    axios(
      `http://localhost:8000/api/update-session/${localStorage.getItem(
        CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION
      )}/`,
      {
        method: "PUT",
        data: {
          date: e.target.value,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        this.props.updateActiveSession(res.data);
      })
      .catch((err) => {});
  };

  render() {
    const { videos, audio } = this.props;
    const childType = localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE);
    const activeChild = localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD);
    const activeChildName = localStorage.getItem(
      CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME
    );

    const sub_links = [
      { name: "Home", link: "/" },
      {
        name:
          childType == CHILD_TYPES.TYPICAL
            ? "Typical Children"
            : "Atypical Children",
        link: childType == CHILD_TYPES.TYPICAL ? "/t_children" : "/at_children",
      },
      {
        name: activeChildName,
        link:
          childType === CHILD_TYPES.TYPICAL
            ? `/t_children/${activeChild}`
            : `/at_children/${activeChild}`,
      },
    ];

    // prepare videos card list
    let video_cards = [];
    for (let i = 0; i < videos.length; i++) {
      const card = (
        <ErrorBoundry>
          <SessionVideoCard video={videos[i] ? videos[i] : null} />
        </ErrorBoundry>
      )
      video_cards.push(card);
    }

    if (videos.length < 4) {
      const card = <SessionVideoCard video={null} />;
      video_cards.push(card);
    }

    return (
      <div className={classes.container1}>
        <Breadcrumbs
          heading={"Session Details"}
          sub_links={sub_links}
          current="Session Details"
          state={null}
        />

        <div className={`container ${classes.container2}`}>
          <form className={classes.form}>
            <div>
              <label>Recorded Date:</label>
              <input
                type="date"
                name="recorded_date"
                value={this.state.date}
                onChange={this.onDateChangeHandler}
              />
            </div>
            {this.state.date.length <= 0 ? (
              <span>You must insert the recorded date!</span>
            ) : null}
          </form>

          <h2>Session Videos</h2>

          <div className={classes.videoCards}>
            {video_cards.map((card, index) => (
              <div className={classes.videoCard} key={index}>
                {card}
              </div>
            ))}
          </div>

          <h2 className={classes.audioHead}>Session Audio</h2>

          <div className={classes.audioCard}>
            <ErrorBoundry>
              <SessionAudioCard audio={this.props.audio} />
            </ErrorBoundry>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  videos: state.videoReducer.videos,
  audio: state.audioReducer.audio,
});

export default connect(mapStateToProps, {
  updateSession,
  updateActiveSession,
  getVideos,
  getAudio,
  setNav,
})(SessionPage);
