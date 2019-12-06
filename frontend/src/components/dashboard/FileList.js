import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from 'axios';
import TableRow from './TableRow';
import ReactPaginate from 'react-paginate';

import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

class FileList extends Component {
  constructor(props) {
    super(props);

    this.handlePageClick = this.handlePageClick.bind(this);

    this.state = {
      currentPageNumber: 1,
      totalItems: 1,
      itemsPerPage: 10,
      files: [],
    };
  }

  componentDidMount() {
    this.getFileList();
  }

  handlePageClick(data) {
    this.setState({ currentPageNumber: data.selected + 1 }, () => {
      this.getFileList();
    });
  }

  getFileList() {
    axios.get('/api/files', {
      params: {
        user: this.props.auth.user,
        config: {
          all: false,
          currentPageNumber: this.state.currentPageNumber,
          itemsPerPage: this.state.itemsPerPage
        }
      }
    })
      .then(response => {
        this.setState({
          files: response.data.files,
          currentPageNumber: response.data.currentPageNumber,
          totalItems: response.data.totalItems,
          itemsPerPage: response.data.itemsPerPage
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  filesList() {
    const { user } = this.props.auth;
    const currentPage = this.state.currentPageNumber;
    const itemsPerPage = this.state.itemsPerPage;

    return this.state.files.map(function (currentFile, i) {
      return <TableRow file={currentFile} key={i} user={user} index={i} currentPage={currentPage} itemsPerPage={itemsPerPage} />
    })
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    let totalPages = Math.ceil(this.state.totalItems / this.state.itemsPerPage);

    return (
      <Container style={{ maxWidth: "none", padding: "30px" }}>
        <Row className="justify-content-between">
          <h3>Files List</h3>
          <Button variant="success" onClick={(e) => this.exportToExecel("exported")}>Export</Button>
        </Row>
        <Row>
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Reg.Time</th>
                <th>User</th>
                <th>Type</th>
                <th>File</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.filesList()}
            </tbody>
          </Table>
        </Row>
        <Row id="react-paginate" className="justify-content-md-center">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={this.state.itemsPerPage}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </Row>
      </Container>
    );
  }
}

FileList.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(FileList);
