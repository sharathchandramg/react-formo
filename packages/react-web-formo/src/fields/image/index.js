import React, { Component } from 'react';
import moment from 'moment';

import { isEmpty } from '../../utils/validators';
import { fileToBase64 } from '../../utils/helper';
import './style.css';

export default class ImageField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  getLabel = (value) => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  handleFile = async (config, images) => {
    if (!isEmpty(images)) {
      const maxFiles = config && config['max_files'] ? config['max_files'] : 1;
      const multiple = config && config['multiple'] ? true : false;

      if (multiple && images.length > maxFiles) {
        this.props.openAlertModal(
          `Please note maximum files allowed is ${maxFiles}`
        );
        return;
      }

      for (const img of images) {
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(img['type'])) {
          this.props.openAlertModal(`${img['name']} file type is not allowed`);
          return;
        } else if (isEmpty(img['size'])) {
          this.props.openAlertModal(
            `${img['name']} file size is empty. Please choose proper file`
          );
          return;
        } else if (img['size'] > 1048576) {
          this.props.openAlertModal(
            `${img['name']} file size is greater than 1MB. Please select file size less than 1MB`
          );
          return;
        }
      }
      const imgValue = [];

      await Promise.all(
        Object.keys(images).map(async (key) => {
          const file = images[key];
          const base64 = await fileToBase64(file);

          const timestamp = moment().utc().valueOf();

          const nameParts = file.name.split('.');
          const ext = nameParts.pop();
          const baseName = nameParts.join('.');

          const uniqueFileName = `${baseName}_${timestamp}.${ext}`;

          imgValue.push({
            url: base64,
            file_name: uniqueFileName,
            mime_type: file.type,
          });
        })
      );

      this.setState({ images: imgValue }, () => {
        this.props.handleDocumentUpdateAndDownload(
          this.props.attributes,
          imgValue,
          'write'
        );
      });
    }
  };

  renderImageInput = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    const additionalConfig =
      !isEmpty(attributes) && !isEmpty(attributes['additional_config'])
        ? attributes['additional_config']
        : {};
    return (
      <div
        className={`image-data-wrapper ${disableCondition ? 'disabled' : ''}`}
      >
        <input
          type="file"
          className="file-input"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(event) =>
            this.handleFile(additionalConfig, event.target.files)
          }
          id={attributes.name}
          multiple={
            additionalConfig && additionalConfig['multiple'] ? true : false
          }
        />
        <label htmlFor={attributes.name} className="input-label-wrapper">
          <p style={{ paddingStart: 5 }}>{attributes.label}</p>
          <i className="fas fa-image"></i>
        </label>
      </div>
    );
  };

  getImgurl = (item) => {
    return !isEmpty(item['base64Data']) ? item['base64Data'] : item['url'];
  };

  renderSelectedImages = (attributes) => {
    const value = attributes.value;
    const images = this.state.images;

    let data = [];
    if (!isEmpty(images) && _.some(images, 'url')) {
      _.forEach(images, (image) => {
        data.push({
          url: image['url'],
        });
      });
    } else if (
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
    return (
      <div className="image-root">
        <div className="image-label-wrapper">
          <div className="image-label-text">
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="image-content-wrapper">{this.renderImageInput()}</div>
        {this.renderSelectedImages(attributes)}
      </div>
    );
  }
}
