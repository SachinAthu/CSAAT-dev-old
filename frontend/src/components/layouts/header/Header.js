import $ from "jquery";
import { Link } from "react-router-dom";

import logo from "../../../assets/svg/logo.svg";
import classes from "./Header.module.css";

import { CHILD_TYPES } from "../../../actions/Types";

const Header = (props) => {

  const signout = () => {}

  return (
    <header id="app_header" className={classes.header}>
      <span>Welcome <strong>sachinAthu!</strong></span>

      <button onClick={signout}>Signout</button>
    </header>
  );
};

export default Header;
