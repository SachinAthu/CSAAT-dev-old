import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer id="app_footer">
      <div className={`${classes.footer}`}>
        <div className={classes.copyright}>
          &copy; Copyright{" "}
          <strong>
            <span>CSAAT</span>
          </strong>
          . All Rights Reserved
        </div>
        <div className={classes.credits}>
          Designed by <a href="#">sachinAthu</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
