import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";

import classes from "./Children.module.css";
import Breadcrumbs from "../layouts/breadcrumbs/Breadcrumbs";
import AddChild from "../modals/addChild/AddChild";
import EmptySVG from "../../assets/svg/empty.svg";
import { customStyles } from "./DatatableStyles";
import DeleteConfirmPopup from "../modals/deleteConfirmAlert/DeleteConfirmAlert";
import { BASE_URL } from '../../config'

import {
  getChildren,
  setActiveChild,
  setActiveChildType,
} from "../../actions/ChildActions";
import {
  deleteSessions,
  deleteActiveSession,
} from "../../actions/SessionActions";
import { deleteVideos } from "../../actions/VideoActions";
import { CHILD_TYPES } from "../../actions/Types";

class Children extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    childType: PropTypes.string,
    getChildren: PropTypes.func.isRequired,
    setActiveChild: PropTypes.func.isRequired,
    setActiveChildType: PropTypes.func.isRequired,
    deleteVideos: PropTypes.func.isRequired,
    deleteSessions: PropTypes.func.isRequired,
    deleteActiveSession: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchVal: "",
      addOrEdit: false,
      editChild: null,
      selectedRows: [],
      deleting: false,
    };
  }

  componentDidMount() {
    const childT = this.props.location.state.childType
    // set child type
    this.props.setActiveChildType(childT);

    this.fetchChildren(childT);
    this.props.deleteSessions();
    this.props.deleteActiveSession();
    this.props.deleteVideos();
  }

  componentDidUpdate(prevProps, prevState) {
    const childT = this.props.location.state.childType
    if (
      prevProps.location.state.childType !== childT
    ) {
      // set child type
      this.props.setActiveChildType(childT);

      this.fetchChildren(childT);
      this.props.deleteSessions();
      this.props.deleteActiveSession();
      this.props.deleteVideos();
    }
  }

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////
  fetchChildren = (childT) => {
    let url = ""
    if(childT == CHILD_TYPES.TYPICAL){
      url = `${BASE_URL}/t-children/`
    }else{
      url = `${BASE_URL}/at-children/`
    }
    axios
      .get(url)
      .then((res) => {
        // console.log(res.data)
        this.props.getChildren(res.data);
      })
      .catch((err) => console.log(err));
  };

  createDataTable = () => {
    const children = this.props.children;
    const childT = this.props.location.state.childType

    let columns1 = []
    if(childT === CHILD_TYPES.TYPICAL){
      columns1.push({
        name: "UNIQUE NO",
        selector: "unique_no",
        sortable: true,
      })
      columns1.push({
        name: "SEQUENCE NO",
        selector: "sequence_no",
        sortable: true,
      })
    }else{
      columns1.push({
        name: "CLIENT NO",
        selector: "clinic_no",
        sortable: true,
      })
    }

    let columns2 = [
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

    const columns3 = columns1.concat(columns2)

    let data = [];
    for (let i = 0; i < children.length; i++) {
      let child = {
        id: children[i].id,
        name: children[i].name,
        dob: children[i].dob,
        gender: children[i].gender,
        cdoc: children[i].cdoc,
        dgform: children[i].dgform,
      };
      if(childT === CHILD_TYPES.TYPICAL){
        child.unique_no = children[i].unique_no
        child.sequence_no = children[i].sequence_no
      }else{
        child.clinic_no = children[i].clinic_no
      }
      
      data.push(child);
    }

    let dataTable = (
      <DataTable
        columns={columns3}
        data={data}
        highlightOnHover={true}
        responsive={true}
        selectableRows={true}
        selectableRowsHighlight={true}
        pagination={true}
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
    this.setState({
      searchVal: e.target.value,
    });
  };

  search = (e) => {
    e.preventDefault();
    console.log(e);
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
    this.props.setActiveChild(child);
    let path = ''
    if(this.props.childType === CHILD_TYPES.TYPICAL){
      path = `t_children/${child.id}`
    }else{
      path = `at_children/${child.id}`
    }
    this.props.history.push({
      pathname: path,
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
    const sub_links = [{ name: "Home", link: "/" }]

    return (
      <div className={`${classes.container1}`}>
        <Breadcrumbs
          heading={this.props.childType === CHILD_TYPES.TYPICAL ? "Typical Children" : "Atypical Children" }
          sub_links={sub_links}
          current={this.props.childType === CHILD_TYPES.TYPICAL ? "Typical Children" : "Atypical Children"}
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
                value={searchVal}
              />

              <button type="submit">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <title>Search</title>
                  <path d="M9.516 14.016q1.875 0 3.188-1.313t1.313-3.188-1.313-3.188-3.188-1.313-3.188 1.313-1.313 3.188 1.313 3.188 3.188 1.313zM15.516 14.016l4.969 4.969-1.5 1.5-4.969-4.969v-0.797l-0.281-0.281q-1.781 1.547-4.219 1.547-2.719 0-4.617-1.875t-1.898-4.594 1.898-4.617 4.617-1.898 4.594 1.898 1.875 4.617q0 0.984-0.469 2.227t-1.078 1.992l0.281 0.281h0.797z"></path>
                </svg>
              </button>
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
            <div className={`${classes.table}`}>{table}</div>
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
  childType: state.childReducer.childType,
});

export default connect(mapStateToProps, {
  getChildren,
  setActiveChild,
  setActiveChildType,
  deleteVideos,
  deleteSessions,
  deleteActiveSession,
})(Children);
