import React, { Component } from "react";
import { Link } from "react-router-dom";

import classes from "./Breadcrumbs.module.css";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let links = [];
    const { sub_links, heading, current } = this.props;

    if (sub_links) {
      for (let i = 0; i < sub_links.length; i++) {
        let link = <Link to={{ pathname:sub_links[i].link, state:this.props.state }}>{sub_links[i].name}</Link>;
        links.push(link);
      }

      links.push(current);
    }

    return (
      <div className='container'>
        <div className={`${classes.breadcrumbs}`}>
          {sub_links ? (
            <ol>
              {links.map((link, index) => (
                <li key={index}>
                  {link}
                </li>
              ))}
            </ol>
          ) : null}

          <h2>{heading}</h2>
        </div>
      </div>
    );
  }
}

export default Breadcrumbs;
