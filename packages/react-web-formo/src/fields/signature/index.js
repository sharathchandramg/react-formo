import React, { Component } from 'react';
import { isEmpty } from '../../utils/validators';
import './style.css';

export default class SignatureField extends Component {
  getLabel = (value) => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  getImgurl = (item) => {
    return !isEmpty(item['base64Data']) ? item['base64Data'] : item['url'];
  };

  renderSelectedImages = (attributes) => {
    const value = attributes.value;

    let data = [];
    if (
      !isEmpty(value) &&
      (_.some(value, 'url') || _.some(value, 'base64Data'))
    ) {
      _.forEach(value, (image) => {
        data.push({
          url: this.getImgurl(image),
        });
      });
    }

    return (
      <div>
        {data.map((item, index) => {
          return (
            <img
              key={index}
              src={item.url}
              alt="image"
              style={{
                width: 250,
                height: 200,
                margin: '0 5px 5px 0',
                cursor: 'pointer',
              }}
              onClick={() => {
                const imageList = [];
                data.forEach((ele) => {
                  imageList.push({
                    original: ele.url,
                  });
                });
                this.props.handleOpenImageModal({
                  label: attributes['label'],
                  imageList,
                  startIndex: index,
                });
              }}
            />
          );
        })}
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div className="sig-root">
        <div className="sig-label-wrapper">
          <div className="sig-label-text">
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="sig-content-wrapper">
          <div
            className={`sig-data-wrapper ${disableCondition ? 'disabled' : ''}`}
            onClick={() => this.props.openSignatureModal(attributes)}
          >
            <p style={{ paddingStart: 5 }}>{attributes.label}</p>
            <i className="fas fa-image"></i>
          </div>
        </div>
        {this.renderSelectedImages(attributes)}
      </div>
    );
  }
}
