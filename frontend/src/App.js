import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import $ from "jquery";

import classes from "./App.module.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Profiles from './components/profiles/Profiles'
import ProfilePage from './components/profilePage/ProfilePage'
import AddSession from './components/addSession/AddSession'

import store from "./store";

const App = () => {
  // Back to top button
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 100) {
      $(`${classes.back_to_top}`).fadeIn("slow");
    } else {
      $(`${classes.back_to_top}`).fadeOut("slow");
    }
  });

  $(`${classes.back_to_top}`).on('click', function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500,
      "easeInOutExpo",
      function () {
        // $(".nav-menu ul:first li:first").addClass('active');
      }
    );

    return false;
  });

  return (
    <Provider store={store}>
      <div className={classes.App}>
        <Router>
          <Header />

          <main id="app_main" className={`${classes.main}`}>
            <Switch>
              <Route exact path="/" component={Profiles} />
              <Route path="/:profile_id/:session_id" render={(props) => <AddSession {...props} />} />
              <Route path="/:profile_id" render={(props) => <ProfilePage {...props} />} /> 
            </Switch>
          </main>
  
          <Footer />
        </Router>

        <a href="#" className={`${classes.back_to_top}`}>
          <i className={"bx bxs-up-arrow-alt"}></i>
        </a>
      </div>
    </Provider>
  );
};

export default App;
