import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

class TopNavbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">React with Excel</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/file/list">File List</Nav.Link>
            <Nav.Link href="/file/upload">Upload File</Nav.Link>
          </Nav>
          <Nav>
            {this.props.auth.isAuthenticated && <Navbar.Text style={{marginRight:"20px"}}>Signed in as : {this.props.auth.user.name} </Navbar.Text>}
            {this.props.auth.isAuthenticated && <Button variant="outline-success" onClick={this.onLogoutClick}>Logout</Button>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

TopNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(TopNavbar);
