import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./SessionPage.module.css";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import SessionVideoCard from "./sessionVideoCard/SessionVideoCard";
import SessionAudioCard from './sessionAudioCard/SessionAudioCard'

import {
  updateSession,
  updateActiveSession,
} from "../../actions/SessionActions";
import { CHILD_TYPES } from '../../actions/Types'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class SessionPage extends Component {
  static propTypes = {
    activeChild: PropTypes.object.isRequired,
    childType: PropTypes.string.isRequired,
    activeSession: PropTypes.object,
    videos: PropTypes.array,
    audio: PropTypes.object,
    updateSession: PropTypes.func.isRequired,
    updateActiveSession: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      uploadedVideoCount: 0,
      allUploaded: false,
    };
  }

  componentDidMount(){
    if(this.props.activeSession.date){
      this.setState({date: this.props.activeSession.date})
    }
  }

  //////////////////////////////////////////////////////////////
  //////////////////////// functions ///////////////////////////
  //////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////
  //////////////////////  event listeners //////////////////////
  //////////////////////////////////////////////////////////////
  // trigger when uploaded date field value changes and update uploaded date immediatly
  onDateChangeHandler = (e) => {
    this.setState({date: e.target.value})
    if(e.target.value === '') return

    // update the session date
    axios(`http://localhost:8000/api/update-session/${this.props.activeSession.id}`, {
      method: "PUT",
      data: {
        "date": e.target.value
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => {
      console.log(res.data)
      this.props.updateActiveSession(res.data)
    }).catch(err => {
      console.log(err)
    });
  };

  render() {
    const { videos, audio, activeChild } = this.props;
    const sub_links = [
      { name: "Home", link: "/" },
      {
        name: this.props.childType == CHILD_TYPES.TYPICAL ? "Typical Children" : "Atypical Children",
        link: this.props.childType == CHILD_TYPES.TYPICAL ? "/t_children" : "/at_children",
      },
      {
        name: activeChild.name,
        link:  this.props.childType === CHILD_TYPES.TYPICAL
        ? `/t_children/${activeChild.id}`
        : `/at_children/${activeChild.id}`,
      }
    ];

    // prepare videos card list
    let video_cards = [];
    for (let i = 0; i < videos.length; i++) {
      const card = <SessionVideoCard video={videos[i] ? videos[i] : null} />;
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
          state={{childType: this.props.childType}}
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
            {this.state.date.length <= 0 ? <span>You must insert the recorded date!</span> : null}
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
              <SessionAudioCard />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeChild: state.childReducer.activeChild, 
  childType: state.childReducer.childType,
  activeSession: state.sessionReducer.activeSession,
  videos: state.videoReducer.videos,
  audio: state.audioReducer.audio,
});

export default connect(mapStateToProps, {
  updateSession,
  updateActiveSession,
})(SessionPage);
