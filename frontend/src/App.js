import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import $ from "jquery";

import classes from "./App.module.css";
import Navbar from "./components/layouts/navbar/Navbar";
import Header from "./components/layouts/header/Header";
import Homepage from "./components/homepage/Homepage";
import TypicalChildren from "./components/children/TypicalChildren/TypicalChildren";
import ATypicalChildren from "./components/children/ATypicalChildren/ATypicalChildren";
import ChildPage from "./components/childPage/ChildPage";
import AddSession from "./components/sessionPage/SessionPage";
import Cameras from './components/cameras/Cameras'
import CameraAngles from './components/cameraAngles/CameraAngles'

import store from "./store";

const App = (props) => {
  // Back to top button
  // $(window).on('scroll', function () {
  //   if ($(this).scrollTop() > 100) {
  //     $(`${classes.back_to_top}`).fadeIn("slow");
  //   } else {
  //     $(`${classes.back_to_top}`).fadeOut("slow");
  //   }
  // });

  $(`${classes.back_to_top}`).on("click", function () {
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
      <Router>
        <div className={classes.app}>
          <Navbar />

          <Header />

          <main id="app_main" className={`${classes.main}`}>

            <Switch>
              <Route path="/t_children/:child_id/:session_id" render={(props) => <AddSession {...props} />} />
              <Route path="/at_children/:child_id/:session_id" render={(props) => <AddSession {...props} />} />
              
              <Route path="/t_children/:child_id" render={(props) => <ChildPage {...props} />} />
              <Route path="/at_children/:child_id" render={(props) => <ChildPage {...props} />} /> 
              
              <Route exact path="/t_children" component={TypicalChildren} />
              <Route exact path="/at_children" component={ATypicalChildren} />

              <Route exact path="/cameras" component={Cameras} />
              <Route exact path="/camera_angles" component={CameraAngles} />

              <Route exact path="/" component={Homepage} />
            </Switch>
          </main>

          <a href="#" className={`${classes.back_to_top}`}>
            <i className={"bx bxs-up-arrow-alt"}></i>
          </a>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
