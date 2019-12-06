import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from 'axios';

import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

class FileUpload extends Component {
    constructor(props) {
        super(props);

        this.onChangeFileDescription = this.onChangeFileDescription.bind(this);
        this.onChangeFileType = this.onChangeFileType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeFile2Upload = this.onChangeFile2Upload.bind(this);

        this.state = {
            file_type: 'Send',
            file_description: '',
            file_owner: this.props.auth.user.name,
            file_selected: null,
            loaded: 0
        }
    }

    onChangeFileDescription(e) {
        this.setState({
            file_description: e.target.value
        });
    }

    onChangeFileType(e) {
        this.setState({
            file_type: e.target.value
        });
    }
    onChangeFile2Upload(e) {
        this.setState({
            file_selected: e.target.files[0],
            loaded: 0,
        });
    }
    onSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        // meta data
        formData.append("file_type", this.state.file_type);
        formData.append("file_description", this.state.file_description);
        formData.append("file_owner", this.state.file_owner);
        // file data
        formData.append("file_data", this.state.file_selected);

        axios.post('/api/files/upload', formData, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                })
            },
        }).then(res => {
            console.log(res.data)
        }).catch(err => { // then print response status
            console.log('upload failed' + err);
        });
    }
    render() {
        return (
            <Container style={{marginTop:"50px"}}>
                <Row className="h3">Upload file to check</Row>
                <Form encType="multipart/form-data" onSubmit={this.onSubmit} style={{marginTop:"50px"}}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}>File Type: </Form.Label>
                        <Col sm={9}>
                            <ToggleButtonGroup type="radio" name="fileType" value={this.state.file_type}>
                                <ToggleButton onChange={this.onChangeFileType} value={"Send"}>Send</ToggleButton>
                                <ToggleButton onChange={this.onChangeFileType} value={"Receive"}>Receive</ToggleButton>
                                <ToggleButton onChange={this.onChangeFileType} value={"Chat"}>Chat</ToggleButton>
                                <ToggleButton onChange={this.onChangeFileType} value={"Download"}>Download</ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}>File Summary</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" required
                                placeholder="File Summary"
                                value={this.state.file_description}
                                onChange={this.onChangeFileDescription} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={3}>File to Upload: </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="file"
                                name="file2upload"
                                id="file2upload"
                                onChange={this.onChangeFile2Upload} />
                        </Col>
                    </Form.Group>
                    <Form.Group>
                        <ProgressBar animated variant="success" now={Math.round(this.state.loaded, 2)} />
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={3}>
                        </Col>
                        <Col sm={9}>
                            <Button type="submit" variant="primary" style={{marginRight:"20px"}} disabled={this.state.loaded === 100}>{this.state.loaded === 100 ? "Uploaded" : "Upload"}</Button>
                            <Button variant="secondary" href="/file/list">Back to List</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

FileUpload.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(FileUpload);
