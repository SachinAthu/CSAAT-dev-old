import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import $ from "jquery";

import classes from "./App.module.css";
import Header from "./components/layouts/header/Header";
import Footer from "./components/layouts/footer/Footer";
import Homepage from './components/homepage/Homepage'
import Children from './components/children/Children'
import ChildPage from './components/childPage/ChildPage'
import AddSession from './components/sessionPage/SessionPage'

import store from "./store";

const App = (props) => {
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
              <Route path="/t_children/:child_id/:session_id" render={(props) => <AddSession {...props} />} />
              <Route path="/at_children/:child_id/:session_id" render={(props) => <AddSession {...props} />} />
              
              <Route path="/t_children/:child_id" render={(props) => <ChildPage {...props} />} />
              <Route path="/at_children/:child_id" render={(props) => <ChildPage {...props} />} /> 
              
              <Route exact path="/t_children" component={Children} />
              <Route exact path="/at_children" component={Children} />

              <Route exact path="/" component={Homepage} />
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
