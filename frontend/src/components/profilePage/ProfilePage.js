import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";

import styles from "./ProfilePage.module.css";
import EmptySVG from '../../assets/svg/empty.svg'
import Breadcrumbs from '../breadcrumbs/Breadcrumbs'

import {
  getSessions,
  addSession,
  setActiveSession,
} from "../../actions/SessionActions";
import { getVideos, deleteVideos } from "../../actions/VideoActions";
import VideoPlay from "./videoPlay/VideoPlay";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ProfilePage extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    sessions: PropTypes.array.isRequired,
    getSessions: PropTypes.func.isRequired,
    addSession: PropTypes.func.isRequired,
    setActiveSession: PropTypes.func.isRequired,
    getVideos: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      updating: false,
    };
  }

  componentDidMount() {
    this.fetchSessions();
  }

  fetchSessions = () => {
    axios
      .get(`http://localhost:8000/api/sessions/${this.props.profile.id}/`)
      .then((res) => {
        console.log(res.data);
        if(res.data[0]){
          this.props.getSessions(res.data);
          this.props.setActiveSession(res.data[0]);
          this.fetchVideos(res.data[0].id);
        }
      })
      .catch((err) => console.log(err));
  };

  fetchVideos = (id) => {
    axios
      .get(`http://localhost:8000/api/videos/${id}/`)
      .then((res) => {
        console.log(res.data);
        this.props.getVideos(res.data);
      })
      .catch((err) => console.log(err));
  };

  onChangeSelect = (e) => {
    // console.log(e.target.value)
    this.fetchVideos(e.target.value);
    const session = this.props.sessions.filter(
      (s, i) => s.id == e.target.value
    );
    this.props.setActiveSession(session);
  };

  addSessionHandler = () => {
    // clear redux videos
    this.props.deleteVideos()

    // navigate to add session component
    this.props.history.push("/add_session");

    // add session
    // axios("http://localhost:8000/api/add-session/", {
    //   method: "POST",
    //   data: {
    //     datetime: null,
    //     profile: this.props.profile.id,
    //     user: null
    //   },
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     // console.log(res.data)

        

    //     // change active session
    //     this.props.addSession(res.data);
    //     this.props.setActiveSession(res.data);
    //   })
    //   .catch((err) => console.log(err));
  };

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

  render() {
    const profile = this.props.profile;
    const sessions = this.props.sessions;

    const select = (
      <select name="sessions" id="session_list" onChange={this.onChangeSelect}>
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

    return (
      <div className={styles.container}>
        <div className={styles.details}>
          <h3>Details</h3>

          <div className={styles.details_div}>
            <span className={styles.details_div_1}>Clinic No</span>
            <span className={styles.details_div_2}>{profile.clinic_no}</span>
          </div>

          <div className={styles.details_div}>
            <span className={styles.details_div_1}>Child Name</span>
            <span className={styles.details_div_2}>{profile.name}</span>
          </div>

          <div className={styles.details_div}>
            <span className={styles.details_div_1}>Date of Birth</span>
            <span className={styles.details_div_2}>{profile.dob}</span>
          </div>

          <div className={styles.details_div}>
            <span className={styles.details_div_1}>Gender</span>
            <span className={styles.details_div_2}>{profile.sex}</span>
          </div>

          <div className={styles.details_div}>
            <span className={styles.details_div_1}>Consent Document</span>

            {profile.consent_doc ? (
              <a
                className={`${styles.viewDocbtn}`}
                href={profile.consent_doc}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.consent_doc_name}
              </a>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>

        <div className={styles.sessions}>
          <h3>Sessions</h3>

          <div className={styles.sessions_div1}>
            <div className={styles.sessions_div2}>
              <span>Select the session by recorded date:</span>
              {select}
            </div>

            <button
              className={`button_primary ${styles.addbtn}`}
              onClick={this.addSessionHandler}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
              </svg>
              Session
            </button>
          </div>

          {sessions.length > 0 ? (
            <div className={styles.videoplay}>
              <VideoPlay />
            </div>
          ) : (
            <div className={styles.novideo}>
              <img src={EmptySVG} alt="No Sessions Image" />
              <h6>There are no Sessions available</h6>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  sessions: state.sessionReducer.sessions,
});

export default connect(mapStateToProps, {
  getSessions,
  addSession,
  setActiveSession,
  getVideos,
  deleteVideos,
})(ProfilePage);
