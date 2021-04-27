import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";

import classes from "../Children.module.css";
import Breadcrumbs from "../../layouts/breadcrumbs/Breadcrumbs";
import AddChild from "../../modals/addChild/AddChild";
import EmptySVG from "../../../assets/svg/empty.svg";
import { customStyles } from "../DatatableStyles";
import DeleteConfirmPopup from "../../modals/deleteConfirmAlert/DeleteConfirmAlert";
import { BASE_URL } from "../../../config";

import { getChildren, deleteChildren } from "../../../actions/ChildActions";
import { deleteSessions } from "../../../actions/SessionActions";
import { deleteVideos } from "../../../actions/VideoActions";
import {
  CHILD_TYPES,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD,
  CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME,
  CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION,
  CSAAT_VIDEO_UPLOAD_CHILDTYPE,
} from "../../../actions/Types";

class TypicalChildren extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    getChildren: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    deleteSessions: PropTypes.func.isRequired,
    deleteChildren: PropTypes.func.isRequired,
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
    };
    this.afterReloadFetch = false;
  }

  componentDidMount() {
    // clear redux store values
    this.props.deleteChildren();
    this.props.deleteSessions();
    this.props.deleteVideos();
    localStorage.removeItem(CSAAT_VIDEO_UPLOAD_ACTIVE_SESSION);

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
    // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight)
    let lastScrollTop = 0;
    const el = document.getElementById("typical_children_table");
    let st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop && el.getBoundingClientRect().bottom <= window.innerHeight) {
      // console.log('bottom')
      // fetch more records
      if (!this.state.isSearching) {
        this.fetchChildren();
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  };

  fetchChildren = () => {
    let url = "";
    if (this.state.nextLink) {
      url = this.state.nextLink;
    } else {
      url = `${BASE_URL}/t-children/`;
    }
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data.results);
        const data = res.data;
        this.props.getChildren(data.results);
        this.setState({
          count: data.count,
          prevLink: data.previous,
          nextLink: data.next,
        });
      })
      .catch((err) => console.log(err));
  };

  filterChildren = (val) => {
    axios
      .get(`${BASE_URL}/t-f-children/?search=${val}`)
      .then((res) => {
        // console.log(res.data);
        this.props.getChildren(res.data);
      })
      .catch((err) => console.log(err));
  };

  createDataTable = () => {
    const children = this.props.children;

    let columns = [
      {
        name: "UNIQUE NO",
        selector: "unique_no",
        sortable: true,
      },
      {
        name: "SEQUENCE NO",
        selector: "sequence_no",
        sortable: true,
      },
      {
        name: "CHILD NAME",
        selector: "name",
        sortable: true,
      },
      {
        name: "DATE OF BIRTH",
        selector: "dob",
        sortable: true,
      },
      {
        name: "GENDER",
        selector: "gender",
        sortable: true,
      },
      {
        name: "CONSENT DOCUMENT",
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
        name: "DATA GATHERING FORM",
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
    console.log(res);
    if (res) {
      this.setState({ selectedRows: [] });
    }
    this.setState({ deleting: false });
  };

  /////////////////////////////////////////////////////
  ////////////////// event listeners //////////////////
  /////////////////////////////////////////////////////
  handleRowSelect = (state) => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", state.selectedRows);
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
    // console.log(id);

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
    // console.log(child);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD, child.id);
    localStorage.setItem(CSAAT_VIDEO_UPLOAD_ACTIVE_CHILD_NAME, child.name);
    this.props.history.push({
      pathname: `/t_children/${child.id}`,
    });
  };

  AddChildHandler = () => {
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
    const {
      searchVal,
      addOrEdit,
      editChild,
      deleting,
      selectedRows,
    } = this.state;

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
                placeholder="Search children..."
                type="text"
                onChange={this.onSearchValChange}
              />
            </form>

            <button
              className={`button_primary ${classes.addbtn}`}
              onClick={this.AddChildHandler}
            >
              New Child
            </button>
          </div>

          {this.props.children.length === 0 ? (
            <div className={`${classes.empty_table}`}>
              <img src={EmptySVG} alt="No records image" />
              <h6>There are no records available</h6>
            </div>
          ) : (
            <div id="typical_children_table" className={`${classes.table}`}>
              {table}
            </div>
          )}
        </div>

        {addOrEdit ? (
          <AddChild close={this.closeAddingWindow} child={editChild} />
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
})(TypicalChildren);
