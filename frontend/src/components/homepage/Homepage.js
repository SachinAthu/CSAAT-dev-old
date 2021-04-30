import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import classes from "./Homepage.module.css";
import { setNav } from "../../actions/NavigationActions";
import { NAV_LINKS, CSAAT_VIDEO_UPLOAD_ACTIVE_NAV } from '../../actions/Types'

class Homepage extends Component {
  static propTypes = {
      setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setNav(NAV_LINKS.NAV_HOME);
    localStorage.setItem(
      CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
      NAV_LINKS.NAV_HOME
    );
  }

  render() {
    return (
      <div className={classes.container}>
        <h1 className={`container`}>Homepage</h1>
      </div>
    );
  }
}

export default connect(null, { setNav })(Homepage);
