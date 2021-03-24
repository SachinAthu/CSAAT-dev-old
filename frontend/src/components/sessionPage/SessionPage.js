import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import classes from "./SessionPage.module.css";
import Breadcrumbs from "../layout/breadcrumbs/Breadcrumbs";

import AddVideoCard from "./sessionVideoCard/SessionVideoCard";
import {
  updateSession,
  updateActiveSession,
} from "../../actions/SessionActions";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AddSession extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    activeSession: PropTypes.object,
    videos: PropTypes.array,
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
    const { videos, profile } = this.props;
    const sub_links = [
      { name: "Profiles", link: "/" },
      { name: `${profile.name}`, link: `/${profile.id}` },
    ];

    // prepare videos card list
    let video_cards = [];
    for (let i = 0; i < videos.length; i++) {
      const card = <AddVideoCard video={videos[i] ? videos[i] : null} />;
      video_cards.push(card);
    }

    if (videos.length < 4) {
      const card = <AddVideoCard video={null} />;
      video_cards.push(card);
    }

    return (
      <div className={classes.container1}>
        <Breadcrumbs
          heading={this.props.isNew ? "New Session" : "Edit Session"}
          sub_links={sub_links}
          current={this.props.isNew ? "new session" : "edit session" }
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.activeProfile,
  activeSession: state.sessionReducer.activeSession,
  videos: state.videoReducer.videos,
});

export default connect(mapStateToProps, {
  updateSession,
  updateActiveSession,
})(AddSession);
