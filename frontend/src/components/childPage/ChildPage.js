import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./ChildPage.module.css";
import EmptySVG from "../../assets/svg/empty.svg";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import BtnSpinner from "../layouts/spinners/btn/BtnSpinner";
import AddSession from "../modals/addSession/AddSession";
import { BASE_URL } from "../../config";
import VideoPlay from "./videoPlay/VideoPlay";
import ErrorBoundry from '../ErrorBoundry'

import {
  getSessions,
  addSession,
  setActiveSession,
} from "../../actions/SessionActions";
import { getVideos, deleteVideos } from "../../actions/VideoActions";
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

class ChildPage extends Component {
  static propTypes = {
    sessions: PropTypes.array.isRequired,
    getSessions: PropTypes.func.isRequired,
    addSession: PropTypes.func.isRequired,
    getVideos: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    getAudio: PropTypes.func.isRequired,
    setActiveSession: PropTypes.func.isRequired,
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      loadingNewBtn: false,
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

    this.fetchSessions();

  }

  //////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////
  //////////////////////////////////////////////////////////////
  // fetch all sessions from DB
  fetchSessions = () => {
    const activeChild = localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD);
    let url = "";
    if (
      localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE) === CHILD_TYPES.TYPICAL
    ) {
      url = `${BASE_URL}/t-sessions/${activeChild}/`;
    } else {
      url = `${BASE_URL}/at-sessions/${activeChild}/`;
    }
    axios
      .get(url)
      .then((res) => {
        if (res.data[0]) {
          this.props.getSessions(res.data);
          this.props.setActiveSession(res.data[0]);
          localStorage.setItem(
            CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
            res.data[0].id
          );
          this.fetchVideos(res.data[0].id);
          this.fetchAudio(res.data[0].id);
        }
      })
      .catch((err) => {});
  };

  // fetch audio for the selected session from DB
  fetchAudio = (id) => {
    axios
      .get(`${BASE_URL}/audio/${id}/`)
      .then((res) => {
        this.props.getAudio(res.data[0]);
      })
      .catch((err) => {});
  };

  // fetch all videos for selected session from DB
  fetchVideos = (id) => {
    axios
      .get(`${BASE_URL}/videos/${id}/`)
      .then((res) => {
        this.props.getVideos(res.data);
      })
      .catch((err) => {});
  };

  // format datetime
  getTime = (datetime) => {
    const day = datetime.slice(0, 10);
    let h = parseInt(datetime.slice(11, 13));
    let m = parseInt(datetime.slice(14, 16));
    let ap;
    let time;

    if (h < 12) {
      // AM
      ap = "AM";
    } else {
      // PM
      ap = "PM";
      h = h - 12;
    }

    h = h.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    m = m.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    time = `${day}  ${h}:${m} ${ap}`;
    return time;
  };

  // close add session modal
  closeAddSessionModal = () => {
    this.setState({ adding: false });
  };

  //////////////////////////////////////////////////////////////////
  ///////////////////// event listeners ////////////////////////////
  //////////////////////////////////////////////////////////////////
  // change selected session when dropdown value change
  onChangeSelectHandler = (e) => {
    this.fetchVideos(e.target.value);
    this.fetchAudio(e.target.value)
    const session = this.props.sessions.filter(
      (s, i) => s.id == e.target.value
    );
    this.props.setActiveSession(session[0]);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION, session[0].id);
  };

  addSessionHandler = () => {
    //open session add modal
    this.setState({ adding: true });
  };

  render() {
    const { sessions } = this.props;

    const select = (
      <select
        name="sessions"
        id="session_list"
        onChange={this.onChangeSelectHandler}
      >
        {sessions.map((s, i) => {
          if (s.date) {
            return (
              <option key={i} value={s.id}>
                {s.date}
              </option>
            );
          } else {
            return (
              <option key={i} value={s.id}>
                No date & time mentioned
              </option>
            );
          }
        })}
      </select>
    );

    const childType = localStorage.getItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE);
    const sub_links = [
      { name: "Home", link: "/" },
      {
        name:
          childType === CHILD_TYPES.TYPICAL
            ? "Typical Children"
            : "Atypical Children",
        link:
          childType === CHILD_TYPES.TYPICAL ? "/t_children" : "/at_children",
      },
    ];

    return (
      <div className={classes.container1}>
        <Breadcrumbs
          heading={"Sessions"}
          sub_links={sub_links}
          current={localStorage.getItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME)}
          state={null}
        />

        <div className={`container ${classes.container2}`}>
          <div className={classes.container2_1}>
            <div className={classes.container2_1_1}>
              <span>Select the session by recorded date:</span>
              {select}
            </div>

            <button
              className={`button_primary ${classes.addbtn}`}
              onClick={this.addSessionHandler}
            >
              {this.state.loadingNewBtn ? <BtnSpinner /> : null}
              New Session
            </button>
          </div>

          {sessions.length > 0 ? (
            <div className={classes.videoplay}>
              <ErrorBoundry>
                <VideoPlay history={this.props.history} />
              </ErrorBoundry>
            </div>
          ) : (
            <div className={classes.nosession}>
              <img src={EmptySVG} alt="No Sessions Image" />
              <h6>There are no Sessions available</h6>
            </div>
          )}
        </div>

        {this.state.adding ? (
          <AddSession close={this.closeAddSessionModal} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessionReducer.sessions,
});

export default connect(mapStateToProps, {
  getSessions,
  addSession,
  getVideos,
  deleteVideos,
  getAudio,
  setActiveSession,
  setNav,
})(ChildPage);
