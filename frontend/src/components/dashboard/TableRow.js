import React, { Component } from 'react';
import axios from 'axios';
import fetchProgress from 'fetch-progress'
import path from 'path';
import upath from 'upath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.check = this.check.bind(this);
        this.downloadFile = this.downloadFile.bind(this);

        this.state = {
            downloadProgress: 0
        }
    }

    check() {
        axios.post('/api/files/check/' + this.props.file._id)
            .then(console.log('Checked or Unchecked'))
            .catch(err => console.log(err));
        window.location = '/file/list';
    }

    downloadFile() {
        const filename = path.basename(upath.normalize(this.props.file.saved_url));
        const self = this;

        fetch('/api/files/download/' + this.props.file._id)
            .then(
                fetchProgress({
                    onProgress(progress) {
                        self.setState({
                            downloadProgress: progress.transferred / progress.total * 100
                        })
                    },
                    onError(err) {
                        console.log(err);
                    },
                    onComplete() {
                        self.setState({
                            downloadProgress: 0
                        })
                    }
                })
            )
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                });
            });
    }

    getDateStr(dateStr) {
        if (dateStr === '' || !dateStr)
            return '';
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }

    render() {
        const index = this.props.index;
        const currentPage = this.props.currentPage;
        const itemsPerPage = this.props.itemsPerPage;
        return (
            <tr key={index}>
                <td style={{ width: "20px" }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td style={{ width: "140px" }}>{this.getDateStr(this.props.file.register_date)}</td>
                <td style={{ width: "150px" }}>{this.props.file.owner}</td>
                <td style={{ width: "90px" }}>{this.props.file.type}</td>
                <td>{path.basename(upath.normalize(this.props.file.saved_url))}</td>
                <td>{this.props.file.description}</td>
                <td style={{ width: "52px" }}>
                    <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                        <Button onClick={this.downloadFile}>{this.state.downloadProgress === 0 ? <FontAwesomeIcon icon={faDownload} /> : `${Math.round(this.state.downloadProgress)}%`}</Button>
                    </OverlayTrigger>
                </td>
            </tr>
        );
    }
}
export default TableRow;