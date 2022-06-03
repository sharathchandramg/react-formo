import React, { Component } from 'react';
import { isEmpty } from '../../utils/validators';
import './style.css';

const allowedContentTypes = {
  pdf: ['application/pdf'],
  images: ['image/jpeg', 'image/png', 'image/jpg'],
  doc: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  xls: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export default class DocumentField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
    };
  }

  getLabel = value => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  getBytesToMB = bytes => {
    return bytes / (1024 * 1024);
  };

  getAcceptContentTypes = config => {
    if (!isEmpty(config) && !isEmpty(config['file_type'])) {
      let contentTypes = [];
      config['file_type'].forEach(item => {
        contentTypes = [...contentTypes, ...allowedContentTypes[item]];
      });
      return contentTypes;
    }

    return ['application/pdf'];
  };

  isFileExists = (res, allFiles) => {
    if (!isEmpty(allFiles)) {
      const fileIndex = allFiles.findIndex(ele => ele && ele['name'] === res);
      if (fileIndex >= 0) return true;
    }
    return false;
  };

  removeDuplicateFiles = (results, existsFiles) => {
    const updatedResults = [];
    if (!isEmpty(results)) {
      results.forEach(ele => {
        if (!existsFiles.includes(ele['name'])) {
          updatedResults.push(ele);
        }
      });
    }
    return updatedResults;
  };

  getAllFiles = results => {
    const { attributes } = this.props;
    const value =
      !isEmpty(attributes) && !isEmpty(attributes.value)
        ? attributes.value
        : [];
    return [...results, ...value];
  };

  handleFile = async (config, docs) => {
    if (!isEmpty(docs)) {
      const value =
        !isEmpty(this.props.attributes) && !isEmpty(this.props.attributes.value)
          ? this.props.attributes.value
          : [];
      const maxFiles = config && config['max_files'] ? config['max_files'] : 1;
      const maxSize =
        config && config['max_size'] ? config['max_size'] : 1048576;
      const existsFiles = [];
      const updatedDocs = [];

      await Promise.all(
        Object.keys(docs).map(async key => {
          updatedDocs.push(docs[key]);
        })
      );
      const allFiles = this.getAllFiles(updatedDocs);

      if (allFiles.length > maxFiles) {
        this.props.openAlertModal(
          `Please note maximum files allowed is ${maxFiles}`
        );
        return;
      }

      for (const doc of updatedDocs) {
        if (!this.getAcceptContentTypes(config).includes(doc['type'])) {
          this.props.openAlertModal(`${doc['name']} file type is not allowed`);
          return;
        } else if (isEmpty(doc['size'])) {
          this.props.openAlertModal(
            `${doc['name']} file size is empty. Please choose proper file`
          );
          return;
        } else if (doc['size'] > maxSize) {
          this.props.openAlertModal(
            `${doc['name']} file size is greater than ${this.getBytesToMB(
              maxSize
            )} MB. Please select file size less than ${this.getBytesToMB(
              maxSize
            )} MB`
          );
          return;
        } else if (this.isFileExists(doc['name'], value)) {
          existsFiles.push(doc['name']);
        }
      }

      const updatedResults = !isEmpty(existsFiles)
        ? this.removeDuplicateFiles(updatedDocs, existsFiles)
        : updatedDocs;

      this.setState({ docs: updatedResults }, () => {
        this.props.handleDocumentUpdateAndDownload(
          this.props.attributes,
          updatedResults
        );
      });
    }
  };

  renderDocumentInput = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    const additionalConfig =
      !isEmpty(attributes) && !isEmpty(attributes['additional_config'])
        ? attributes['additional_config']
        : {};
    return (
      <div className={`doc-data-wrapper ${disableCondition ? 'disabled' : ''}`}>
        <input
          type="file"
          className="file-input"
          accept={this.getAcceptContentTypes(additionalConfig).join(',')}
          onChange={event =>
            this.handleFile(additionalConfig, event.target.files)
          }
          id={attributes.name}
          multiple={
            additionalConfig && additionalConfig['multiple'] ? true : false
          }
        />
        <label htmlFor={attributes.name} className="input-label-wrapper">
          <p style={{ paddingStart: 5 }}>{attributes.label}</p>
          <i className="fas fa-file"></i>
        </label>
      </div>
    );
  };

  getImgurl = item => {
    return !isEmpty(item['base64Data']) ? item['base64Data'] : item['url'];
  };

  renderSelectedDocument = attributes => {
    const value = attributes.value;
    const data = !isEmpty(value) ? value : [];

    return (
      <div style={{ paddingTop: '10px' }}>
        {data.map((item, index) => {
          return (
            <div className="doc-item-wrapper" key={`doc-${index}`}>
              <p
                onClick={() => {
                  this.props.handlePreviewDocument(item);
                }}
              >
                {item.name}
              </p>
              <i
                className="fas fa-trash"
                onClick={() => {
                  this.props.handleOpenDeleteDocDailog({
                    attributes: attributes,
                    doc: item,
                  });
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { attributes } = this.props;

    return (
      <div className="doc-root">
        <div className="doc-label-wrapper">
          <div className="doc-label-text">
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="doc-content-wrapper">{this.renderDocumentInput()}</div>
        {this.renderSelectedDocument(attributes)}
      </div>
    );
  }
}
