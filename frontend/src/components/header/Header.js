import $ from "jquery";
import { Link } from "react-router-dom";

import logo from "../../assets/svg/logo.svg";
import classes from "./Header.module.css";

const Header = () => {
  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function () {
    if ($(this).scrollTop() > 140) {
      $("#app_header")
        .children("div")
        .first()
        .addClass(`${classes.header_scrolled}`);
    } else {
      $("#app_header")
        .children("div")
        .first()
        .removeClass(`${classes.header_scrolled}`);
    }
  });

  return (
    <header id="app_header">
      <div className={`${classes.wrapper} fixed-top d-flex`}>
        <div className={`container d-flex ${classes.header}`}>
          <div className={`${classes.logo} mr-auto`}>
            <a href="#">
              <img src={logo} alt="logo" className={`img-fluid`} />
            </a>
            <h1 className={"text-light"}>
              <a href="#">
                <span>CSAAT</span>
              </a>
            </h1>
            <h4 className={"text-light"}>
              <a href="#">
                <span>Video Uploader</span>
              </a>
            </h4>
          </div>

          <nav className={`${classes.nav_menu} d-none d-lg-block`}>
            <ul>
              <li>
                <Link to="/">Profiles</Link>
              </li>
              <li>
                <Link to="/">Quick Upload</Link>
              </li>
              <li>
                <Link to="/">Cameras</Link>
              </li>
              <li>
                <a href="http://127.0.0.1:8000/admin/" target="_blank">Admin Panel</a>
              </li>
              <li className={`${classes.seperater}`}>&nbsp;</li>
              <li className={`${classes.drop_down}`}>
                <a href="">sachinAthu</a>
                <ul>
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Settings</a>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
