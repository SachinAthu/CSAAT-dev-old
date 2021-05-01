import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";

import classes from "../../assets/css/TableComponent.module.css";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import AddCameraAngle from "../modals/addCameraAngle/AddCameraAngle";
import EmptySVG from "../../assets/svg/empty.svg";
import { customStyles } from "../DatatableStyles";
import DeleteConfirmPopup from "../modals/deleteConfirmAlert/DeleteConfirmAlert";
import { BASE_URL } from "../../config";
import ErrorBoundry from "../ErrorBoundry";
import PageSpinner from "../layouts/spinners/page/PageSpinner";

import {
  getCameraAngles,
  deleteCameraAngles,
} from "../../actions/CameraAngleActions";
import { deleteSessions } from "../../actions/SessionActions";
import { deleteVideos } from "../../actions/VideoActions";
import { setNav } from "../../actions/NavigationActions";
import {
  NAV_LINKS,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
} from "../../actions/Types";

class CameraAngles extends Component {
  static propTypes = {
    cameraAngles: PropTypes.array.isRequired,
    getCameraAngles: PropTypes.func.isRequired,
    deleteCameraAngles: PropTypes.func.isRequired,
    deleteSessions: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      selectedRows: [],
      deleting: false,
      loading: false,
    };
  }

  componentDidMount() {
    // clear redux store values
    this.props.deleteCameraAngles();
    this.props.deleteSessions();
    this.props.deleteVideos();
    localStorage.removeItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION);

    // set navigation link
    this.props.setNav(NAV_LINKS.NAV_CAMERA_ANGLES);
    localStorage.setItem(
      CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
      NAV_LINKS.NAV_CAMERA_ANGLES
    );

    // fetch camera angles
    this.fetchCameraAngles();
  }

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////

  fetchCameraAngles = () => {
    this.setState({ loading: true });
    axios
      .get(`${BASE_URL}/camera-angles/`)
      .then((res) => {
        this.props.getCameraAngles(res.data);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  filterCameraAngles = (val) => {
    axios
      .get(`${BASE_URL}/f-camera-angles/?search=${val}`)
      .then((res) => {
        this.props.getCameraAngles(res.data);
      })
      .catch((err) => {});
  };

  closeAddingWindow = () => {
    this.setState({ adding: false });
  };

  closeDeleteConfirmPopup = (res) => {
    if (res) {
      this.setState({ selectedRows: [] });
    }
    this.setState({ deleting: false });
  };

  createDataTable = () => {
    const cameraAngles = this.props.cameraAngles;

    let columns = [
      {
        name: "Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "",
        sortable: false,
        cell: (row) => (
          <Fragment>
            <button
              className={classes.removebtn}
              onClick={this.deleteCameraAngleHandler.bind(this, row)}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Delete</title>
                <path d="M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12q0 0.797-0.609 1.406t-1.406 0.609h-7.969q-0.797 0-1.406-0.609t-0.609-1.406z"></path>
              </svg>
            </button>
          </Fragment>
        ),
      },
    ];

    let data = [];
    for (let i = 0; i < cameraAngles.length; i++) {
      let cameraAngle = {
        id: cameraAngles[i].id,
        name: cameraAngles[i].name,
      };
      data.push(cameraAngle);
    }

    let dataTable = (
      <DataTable
        columns={columns}
        data={data}
        highlightOnHover={true}
        responsive={true}
        selectableRows={true}
        selectableRowsHighlight={true}
        pagination={false}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
        customStyles={customStyles}
        onSelectedRowsChange={this.handleRowSelect}
      />
    );

    return dataTable;
  };

  ///////////////////////////////////////////////
  /////////////// event handlers ////////////////
  ///////////////////////////////////////////////

  handleRowSelect = (state) => {
    this.setState({
      selectedRows: state.selectedRows,
    });
  };

  onSearchValChange = (e) => {
    const val = e.target.value;

    this.props.deleteCameraAngles();

    if (val === "") {
      // load all data
      this.setState({ isSearching: false });
      this.fetchCameraAngles();
    } else {
      // load filtered data
      this.setState({ isSearching: true });
      this.filterCameraAngles(val);
    }
  };

  deleteCameraAngleHandler = (camera) => {
    // open delete confirm box
    let cameraAngles = [...this.state.selectedRows];

    let res = false;
    for (let i = 0; i < cameraAngles.length; i++) {
      if (cameraAngles[i].id === camera.id) res = true;
    }

    if (!res) {
      cameraAngles.push(camera);
    }

    this.setState({ deleting: true, selectedRows: cameraAngles });
  };

  addCameraAngleHandler = () => {
    this.setState({
      adding: true,
    });
  };

  render() {
    const { adding, deleting, selectedRows } = this.state;

    const table = this.createDataTable();
    const sub_links = [{ name: "Home", link: "/" }];

    return (
      <div className={`${classes.container1}`}>
        <Breadcrumbs
          heading="Camera Angles"
          sub_links={sub_links}
          current="Camera Angles"
          state={null}
        />

        <div className={`container ${classes.container2}`}>
          <div className={classes.search_container}>
            <form onSubmit={this.search} className={classes.form}>
              <input
                id="searchField"
                name="searchField"
                placeholder="Search camera angles by name..."
                type="text"
                onChange={this.onSearchValChange}
              />
            </form>

            <button
              className={`button_primary ${classes.addbtn}`}
              onClick={this.addCameraAngleHandler}
            >
              New Camera Angle
            </button>
          </div>

          {this.state.loading ? (
            <div className={classes.loading_div}>
              <PageSpinner />
            </div>
          ) : (
            <Fragment>
              {this.props.cameraAngles.length === 0 ? (
                <div className={`${classes.empty_table}`}>
                  <img src={EmptySVG} alt="No records image" />
                  <h6>There are no records available</h6>
                </div>
              ) : (
                <div className={`${classes.table}`}>
                  <div className={classes.table_info_refresh}>
                    <span>
                      Showing {this.props.cameraAngles.length} total records
                    </span>
                    <button onClick={this.fetchCameraAngles}>
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <title>Refresh</title>
                        <path d="M12 18v-3l3.984 3.984-3.984 4.031v-3q-3.281 0-5.648-2.367t-2.367-5.648q0-2.344 1.266-4.266l1.453 1.453q-0.703 1.266-0.703 2.813 0 2.484 1.758 4.242t4.242 1.758zM12 3.984q3.281 0 5.648 2.367t2.367 5.648q0 2.344-1.266 4.266l-1.453-1.453q0.703-1.266 0.703-2.813 0-2.484-1.758-4.242t-4.242-1.758v3l-3.984-3.984 3.984-4.031v3z"></path>
                      </svg>
                    </button>
                  </div>
                  {table}
                </div>
              )}
            </Fragment>
          )}
        </div>

        {adding ? (
          <ErrorBoundry>
            <AddCameraAngle close={this.closeAddingWindow} />
          </ErrorBoundry>
        ) : null}

        {deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            header="cameraAngle"
            many={selectedRows.length > 1 ? true : false}
            type={"cameraAngle"}
            data={selectedRows}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cameraAngles: state.cameraAngleReducer.cameraAngles,
});

export default connect(mapStateToProps, {
  getCameraAngles,
  deleteCameraAngles,
  deleteSessions,
  deleteVideos,
  setNav,
})(CameraAngles);
