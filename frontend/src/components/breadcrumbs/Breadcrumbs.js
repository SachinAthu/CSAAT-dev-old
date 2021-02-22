import classes from "./Breadcrumbs.module.css";

const Breadcrumbs = (props) => {
  let sub_links = props.sub_links;

  if (sub_links) {
    // create navigation
  }

  return (
    <div className={`${classes.breadcrumbs}`}>
      <div className={`container`}>
        {sub_links ? (
          <ol>
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>Inner Page</li>
          </ol>
        ) : null}

        <h2>{props.heading}</h2>
      </div>
    </div>
  );
};

export default Breadcrumbs;
