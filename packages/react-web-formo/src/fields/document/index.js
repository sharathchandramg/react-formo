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
    let contentTypes = [];

    if (!isEmpty(config) && !isEmpty(config['file_type'])) {
      config['file_type'].forEach(item => {
        contentTypes = [...contentTypes, ...allowedContentTypes[item]];
      });
    }

    return contentTypes;
  };

  handleFile = async (config, docs) => {
    if (!isEmpty(docs)) {
      if (config['multiple'] && docs.length > config['max_files']) {
        this.props.openAlertModal(
          `Please note maximum files allowed is ${config['max_files']}`
        );
        return;
      }

      for (const doc of docs) {
        if (!this.getAcceptContentTypes(config).includes(doc['type'])) {
          this.props.openAlertModal(`${doc['name']} file type is not allowed`);
          return;
        } else if (isEmpty(doc['size'])) {
          this.props.openAlertModal(
            `${doc['name']} file size is empty. Please choose proper file`
          );
          return;
        } else if (doc['size'] > config['max_size']) {
          this.props.openAlertModal(
            `Please select file size less than ${this.getBytesToMB(
              config['max_size']
            )} MB`
          );
          return;
        }
      }
      const updatedDocs = [];

      await Promise.all(
        Object.keys(docs).map(async key => {
          updatedDocs.push(docs[key]);
        })
      );
      console.log(updatedDocs);
      this.setState({ docs: updatedDocs });
      // this.setState({ docs: updatedDocs }, () => {
      //   this.props.handleDocumentUpdateAndDownload(
      //     this.props.attributes,
      //     updatedDocs,
      //     'write'
      //   );
      // });
    }
  };

  renderDocumentInput = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    const additionalConfig =
      !isEmpty(attributes) && !isEmpty(attributes['additional_config'])
        ? attributes['additional_config']
        : null;
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
          multiple={additionalConfig['multiple']}
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
    const docs = this.state.docs;

    return (
      <div style={{ paddingTop: '10px' }}>
        {docs.map((item, index) => {
          return (
            <div className="doc-item-wrapper">
              <p>{item.name}</p>
              <i className="fas fa-trash" />
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
