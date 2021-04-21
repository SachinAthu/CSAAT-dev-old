import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import classes from "./ChildPage.module.css";
import EmptySVG from "../../assets/svg/empty.svg";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import BtnSpinner from "../layouts/spinners/btn/BtnSpinner";
import AddSession from "../modals/addSession/AddSession";
import { BASE_URL } from '../../config'
import VideoPlay from "./videoPlay/VideoPlay";

import {
  getSessions,
  addSession,
  setActiveSession,
} from "../../actions/SessionActions";
import { getVideos, deleteVideos } from "../../actions/VideoActions";
import { getAudio } from '../../actions/AudioActions'
import { CHILD_TYPES } from '../../actions/Types'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class ChildPage extends Component {
  static propTypes = {
    activeChild: PropTypes.object.isRequired,
    childType: PropTypes.string.isRequired,
    sessions: PropTypes.array.isRequired,
    getSessions: PropTypes.func.isRequired,
    addSession: PropTypes.func.isRequired,
    setActiveSession: PropTypes.func.isRequired,
    getVideos: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    getAudio: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      loadingNewBtn: false,
    };
  }

  componentDidMount() {
    this.fetchSessions();
  }

  //////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////
  //////////////////////////////////////////////////////////////
  // fetch all sessions from DB
  fetchSessions = () => {
    let url = ""
    if(this.props.childType === CHILD_TYPES.TYPICAL){
      url = `${BASE_URL}/t-sessions/${this.props.activeChild.id}/`
      console.log(url)
    }else{
      url = `${BASE_URL}/at-sessions/${this.props.activeChild.id}/`
    }
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        if (res.data[0]) {
          this.props.getSessions(res.data);
          this.props.setActiveSession(res.data[0]);
          this.fetchVideos(res.data[0].id);
          this.fetchAudio(res.data[0].id);
        }
      })
      .catch((err) => console.log(err));
  };

  // fetch audio for the selected session from DB
  fetchAudio = (id) => {
    axios
      .get(`${BASE_URL}/audio/${id}/`)
      .then((res) => {
        console.log(res.data);
        this.props.getAudio(res.data[0]);
      })
      .catch((err) => console.log(err));
  }

  // fetch all videos for selected session from DB
  fetchVideos = (id) => {
    axios
      .get(`${BASE_URL}/videos/${id}/`)
      .then((res) => {
        // console.log(res.data);
        this.props.getVideos(res.data);
      })
      .catch((err) => console.log(err));
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
    // console.log(e.target.value)
    this.fetchVideos(e.target.value);
    const session = this.props.sessions.filter(
      (s, i) => s.id == e.target.value
    );
    this.props.setActiveSession(session[0]);
  };

  addSessionHandler = () => {
    //open session add modal
    this.setState({ adding: true });
  };

  render() {
    const activeChild = this.props.activeChild;
    const sessions = this.props.sessions;

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

    const sub_links = [
      { name: "Home", link: "/" },
      {
        name:
          this.props.childType === CHILD_TYPES.TYPICAL
            ? "Typical Children"
            : "Atypical Children",
        link: this.props.childType === CHILD_TYPES.TYPICAL
        ? "/t_children"
        : "/at_children",
      },
    ];

    return (
      <div className={classes.container1}>
        <Breadcrumbs
          heading={"Sessions"}
          sub_links={sub_links}
          current={activeChild.name}
          state={{childType: this.props.childType}}
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
              <VideoPlay history={this.props.history} />
            </div>
          ) : (
            <div className={classes.novideo}>
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
  activeChild: state.childReducer.activeChild,
  childType: state.childReducer.childType,
  sessions: state.sessionReducer.sessions,
});

export default connect(mapStateToProps, {
  getSessions,
  addSession,
  setActiveSession,
  getVideos,
  deleteVideos,
  getAudio,
})(ChildPage);