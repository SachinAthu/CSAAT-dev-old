import $ from "jquery";

import classes from "./Header.module.css";

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
