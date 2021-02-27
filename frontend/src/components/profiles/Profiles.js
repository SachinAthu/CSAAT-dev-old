import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";

import classes from "./Profiles.module.css";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import AddProfile from "./addProfile/AddProfile";
import EmptySVG from "../../assets/svg/empty.svg";
import { customStyles } from "./DatatableStyles";
import DeleteConformPopup from "../deleteConfirmPopup/DeleteConformPopup";

import {
  getProfiles,
  setActiveProfile,
} from "../../actions/ProfileActions";

class Profiles extends Component {
  static propTypes = {
    profiles: PropTypes.array.isRequired,
    getProfiles: PropTypes.func.isRequired,
    setActiveProfile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchVal: "",
      addOrEdit: false,
      editProfile: null,
      selectedRows: [],
      deleting: false,
    };
  }

  componentDidMount() {
    this.fetchProfiles();
  }

  ///////////////////////////////////////////////
  ////////////////// functions //////////////////
  ///////////////////////////////////////////////
  fetchProfiles = () => {
    axios
      .get("http://localhost:8000/api/profiles/")
      .then((res) => {
        // console.log(res.data)
        this.props.getProfiles(res.data);
      })
      .catch((err) => console.log(err));
  };

  createDataTable = () => {
    const profiles = this.props.profiles;

    let columns = [
      {
        name: "CLINIC NO",
        selector: "clinic_no",
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
        selector: "sex",
        sortable: true,
      },
      {
        name: "CONSENT DOCUMENT",
        sortable: false,
        cell: (row) => {
          if (row.consent_doc) {
            return (
              <a
                className={classes.viewDocbtn}
                href={`http://127.0.0.1:8000${row.consent_doc}`}
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
              onClick={this.toProfileHandler.bind(this, row)}
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
              onClick={this.deleteProfileHandler.bind(this, row)}
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
    for (let i = 0; i < profiles.length; i++) {
      let profile = {
        id: profiles[i].id,
        clinic_no: profiles[i].clinic_no,
        name: profiles[i].name,
        dob: profiles[i].dob,
        sex: profiles[i].sex,
        consent_doc: profiles[i].consent_doc,
      };
      data.push(profile);
    }

    let dataTable = (
      <DataTable
        columns={columns}
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
    this.setState({ addOrEdit: false, editProfile: null });
  };

  closeDeleteConfirmPopup = (res) => {
    console.log(res)
    if(res){
      this.setState({selectedRows: []})
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

  deleteProfileHandler = (profile) => {
    // console.log(id);

    // open delete confirm box
    let profiles = [...this.state.selectedRows];
    
    let res = false;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].id === profile.id) res = true;
    }
    
    if (!res) {
      profiles.push(profile);
    }
    
    this.setState({deleting: true, selectedRows: profiles})
  };

  toProfileHandler = (profile) => {
    // console.log(profile);
    this.props.setActiveProfile(profile);
    this.props.history.push({
      pathname: `/${profile.id}`,
    });
  };

  addProfileHandler = () => {
    this.setState({
      addOrEdit: true,
    });
  };

  editHandler = (profile) => {
    this.setState({
      editProfile: profile,
      addOrEdit: true,
    });
  };

  render() {
    const { searchVal, addOrEdit, editProfile, deleting, selectedRows } = this.state;

    const table = this.createDataTable();

    return (
      <div className={`${classes.container1}`}>
        <Breadcrumbs heading={"Children Profiles"} sub_links={null} />

        <div className={`container ${classes.container2}`}>
          <div className={classes.search_container}>
            <form onSubmit={this.search} className={classes.form}>
              <input
                id="searchField"
                name="searchField"
                placeholder="Search profiles..."
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
              onClick={this.addProfileHandler}
            >
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
              </svg>
              New
            </button>
          </div>

          {this.props.profiles.length === 0 ? (
            <div className={`${classes.empty_table}`}>
              <img src={EmptySVG} alt="No Profiles Image" />
              <h6>There are no Profiles available</h6>
            </div>
          ) : (
            <div className={`${classes.table}`}>{table}</div>
          )}

          {addOrEdit ? (
            <AddProfile close={this.closeAddingWindow} profile={editProfile} />
          ) : null}

          {deleting ? (
            <DeleteConformPopup 
              close={(res) => this.closeDeleteConfirmPopup(res)} 
              many={selectedRows.length > 0 ? true : false}
              header={"profile"}
              msg={"By deleting a profile all referenced sessions, documents, videos will also be deleted."}
              data={selectedRows}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profiles: state.profileReducer.profiles,
});

export default connect(mapStateToProps, {
  getProfiles,
  setActiveProfile,
})(Profiles);
