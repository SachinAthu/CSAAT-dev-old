import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";

import classes from "../../../assets/css/TableComponent.module.css";
import Breadcrumbs from "../../layouts/breadcrumbs/Breadcrumbs";
import AddChild from "../../modals/addChild/AddChild";
import EmptySVG from "../../../assets/svg/empty.svg";
import { customStyles } from "../../DatatableStyles";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import { BASE_URL } from "../../../config";
import ErrorBoundry from "../../ErrorBoundry";
import PageSpinner from "../../layouts/spinners/page/PageSpinner";

import { getChildren, deleteChildren } from "../../../actions/ChildActions";
import { deleteSessions } from "../../../actions/SessionActions";
import { deleteVideos } from "../../../actions/VideoActions";
import { setNav } from "../../../actions/NavigationActions";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME,
  CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
  NAV_LINKS,
} from "../../../actions/Types";

class TypicalChildren extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    getChildren: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    deleteSessions: PropTypes.func.isRequired,
    deleteChildren: PropTypes.func.isRequired,
    setNav: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      addOrEdit: false,
      editChild: null,
      selectedRows: [],
      deleting: false,
      count: 0,
      nextLink: null,
      prevLink: null,
      isSearching: false,
      loading: false,
    };
    this.lastClick = 0;
  }

  componentDidMount() {
    // clear redux store values
    this.props.deleteChildren();
    this.props.deleteSessions();
    this.props.deleteVideos();
    localStorage.removeItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION);

    // set navigation link
    this.props.setNav(NAV_LINKS.NAV_TYPICAL_CHILD);
    localStorage.setItem(
      CSAAT_VIDEO_UPLOAD_ACTIVE_NAV,
      NAV_LINKS.NAV_TYPICAL_CHILD
    );

    // store child type on localstorage
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_CHILDTYPE, CHILD_TYPES.TYPICAL);
    // fetch typical children
    this.fetchChildren();

    document.addEventListener("scroll", this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
  }

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////
  // set on scroll event
  trackScrolling = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 120
    ) {
      // fetch more records
      if (!this.state.isSearching) {
        this.fetchChildren();
      }
    }
  };
  
  fetchChildren = (refresh = false) => {
    var delay = 20;
    if (this.lastClick >= (Date.now() - delay)){
      return;
    }
    this.lastClick = Date.now()

    let url = "";
    if(refresh) {
      this.props.deleteChildren()
      url = `${BASE_URL}/t-children/`;
    }else {
      if (this.state.nextLink) {
        url = this.state.nextLink;
      } else {
        url = `${BASE_URL}/t-children/`;
      }
    }
    if(this.props.children.length == 0) {
      this.setState({ loading: true });
    }
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        this.props.getChildren(data.results);
        this.setState({
          count: data.count,
          prevLink: data.previous,
          nextLink: data.next,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  filterChildren = (val) => {
    axios
      .get(`${BASE_URL}/t-f-children/?search=${val}`)
      .then((res) => {
        this.props.getChildren(res.data);
      })
      .catch((err) => {});
  };

  createDataTable = () => {
    const children = this.props.children;

    let columns = [
      {
        name: "Unique No",
        selector: "unique_no",
        sortable: true,
      },
      {
        name: "Sequence No",
        selector: "sequence_no",
        sortable: true,
      },
      {
        name: "Child Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "Date of Birth",
        selector: "dob",
        sortable: true,
      },
      {
        name: "Gender",
        selector: "gender",
        sortable: true,
      },
      {
        name: "Consent Document",
        sortable: false,
        cell: (row) => {
          if (row.cdoc) {
            return (
              <a
                className={classes.viewDocbtn}
                href={`http://127.0.0.1:8000${row.cdoc}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            );
          } else {
            return "-";
          }
        },
      },
      {
        name: "Data Gathering Form",
        sortable: false,
        cell: (row) => {
          if (row.dgform) {
            return (
              <a
                className={classes.viewDocbtn}
                href={`http://127.0.0.1:8000${row.dgform}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            );
          } else {
            return "-";
          }
        },
      },
      {
        name: "",
        sortable: false,
        cell: (row) => (
          <Fragment>
            <button
              className={classes.viewbtn}
              onClick={this.toChildHandler.bind(this, row)}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <title>Go to Details</title>
                <path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>
              </svg>
            </button>

            <button
              className={classes.editbtn}
              onClick={this.editHandler.bind(this, row)}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Edit</title>
                <path d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828q0.281-0.281 0.703-0.281t0.703 0.281l2.344 2.344q0.281 0.281 0.281 0.703t-0.281 0.703zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path>
              </svg>
            </button>

            <button
              className={classes.removebtn}
              onClick={this.deleteChildHandler.bind(this, row)}
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
    for (let i = 0; i < children.length; i++) {
      let child = {
        id: children[i].id,
        name: children[i].name,
        dob: children[i].dob,
        gender: children[i].gender,
        cdoc: children[i].cdoc,
        dgform: children[i].dgform,
        unique_no: children[i].unique_no,
        sequence_no: children[i].sequence_no,
      };
      data.push(child);
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

  closeAddingWindow = () => {
    this.setState({ addOrEdit: false, editChild: null });
  };

  closeDeleteConfirmPopup = (res) => {
    if (res) {
      this.setState({ selectedRows: [] });
    }
    this.setState({ deleting: false });
  };

  /////////////////////////////////////////////////////
  ////////////////// event listeners //////////////////
  /////////////////////////////////////////////////////
  handleRowSelect = (state) => {
    this.setState({
      selectedRows: state.selectedRows,
    });
  };

  onSearchValChange = (e) => {
    const val = e.target.value;

    this.setState({ count: 0, prevLink: null, nextLink: null });
    this.props.deleteChildren();

    if (val === "") {
      // load all data
      this.setState({ isSearching: false });
      this.fetchChildren();
    } else {
      // load filtered data
      this.setState({ isSearching: true });
      this.filterChildren(val);
    }
  };

  deleteChildHandler = (child) => {
    // open delete confirm box
    let children = [...this.state.selectedRows];

    let res = false;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === child.id) res = true;
    }

    if (!res) {
      children.push(child);
    }

    this.setState({ deleting: true, selectedRows: children });
  };

  toChildHandler = (child) => {
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD, child.id);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME, child.name);
    this.props.history.push({
      pathname: `/t_children/${child.id}`,
    });
  };

  addChildHandler = () => {
    this.setState({
      addOrEdit: true,
    });
  };

  editHandler = (child) => {
    this.setState({
      editChild: child,
      addOrEdit: true,
    });
  };

  render() {
    const { addOrEdit, editChild, deleting, selectedRows } = this.state;

    const table = this.createDataTable();
    const sub_links = [{ name: "Home", link: "/" }];

    return (
      <div className={`${classes.container1}`}>
        <Breadcrumbs
          heading="Typical Children"
          sub_links={sub_links}
          current="Typical Children"
          state={null}
        />

        <div className={`container ${classes.container2}`}>
          <div className={classes.search_container}>
            <form onSubmit={this.search} className={classes.form}>
              <input
                id="searchField"
                name="searchField"
                placeholder="Search children by any field..."
                type="text"
                onChange={this.onSearchValChange}
              />
            </form>

            <button
              className={`button_primary ${classes.addbtn}`}
              onClick={this.addChildHandler}
            >
              New Child
            </button>
          </div>

          {this.state.loading ? (
            <div className={classes.loading_div}>
              <PageSpinner />
            </div>
          ) : (
            <Fragment>
              {this.props.children.length === 0 ? (
                <div className={`${classes.empty_table}`}>
                  <img src={EmptySVG} alt="No records image" />
                  <h6>There are no records available</h6>
                </div>
              ) : (
                <div id="typical_children_table" className={`${classes.table}`}>
                  <div className={classes.table_info_refresh}>
                    <span>
                      Showing {this.props.children.length} out of {this.state.count} records
                    </span>
                    <button onClick={this.fetchChildren.bind(this, true)}>
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

        {addOrEdit ? (
          <ErrorBoundry>
            <AddChild close={this.closeAddingWindow} child={editChild} />
          </ErrorBoundry>
        ) : null}

        {deleting ? (
          <DeleteConfirmPopup
            close={(res) => this.closeDeleteConfirmPopup(res)}
            header="child"
            many={selectedRows.length > 1 ? true : false}
            type={"child"}
            data={selectedRows}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  children: state.childReducer.children,
});

export default connect(mapStateToProps, {
  getChildren,
  deleteVideos,
  deleteSessions,
  deleteChildren,
  setNav,
})(TypicalChildren);
