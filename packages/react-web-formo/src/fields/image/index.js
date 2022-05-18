import React, { Component } from 'react';
import { isEmpty } from '../../utils/validators';
import { blobToBase64 } from '../../utils/helper';
import './style.css';

export default class ImageField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  handleOnclick = () => {
    if (typeof this.props.renderComponent === 'function') {
      this.props.renderComponent(this.props);
    }
    return;
  };

  getLabel = value => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  handleFile = async (name, config, images) => {
    if (!isEmpty(images)) {
      if (config['multiple'] && images.length > config['maxFiles']) {
        this.handleCloseDialog(
          `Please note maximum files allowed is ${config['maxFiles']}`
        );
        return;
      }

      for (const img of images) {
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(img['type'])) {
          this.handleCloseDialog(`${img['name']} file type is not allowed`);
          return;
        } else if (isEmpty(img['size'])) {
          this.handleCloseDialog(
            `${img['name']} file size is empty. Please choose proper file`
          );
          return;
        } else if (img['size'] > 528384) {
          this.handleCloseDialog(
            `${
              img['name']
            } file size is greater than 512kb. Please select file size less than 512kb`
          );
          return;
        }
      }
      const imgValue = [];

      await Promise.all(
        Object.keys(images).map(async key => {
          const base64 = await blobToBase64(images[key]);
          imgValue.push({
            url: base64,
            file_name: images[key].name,
            mime_type: images[key].type,
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

  renderImageUI = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    const additionalConfig =
      !isEmpty(attributes) && !isEmpty(attributes['additional_config'])
        ? attributes['additional_config']
        : null;
    return (
      <div
        className={`image-data-wrapper ${disableCondition ? 'disabled' : ''}`}
        onClick={() => this.handleOnclick()}
      >
        <input
          type="file"
          className="file-input"
          accept="image/jpeg,image/png,image/jpg"
          onChange={event =>
            this.handleFile(
              attributes.name,
              additionalConfig,
              event.target.files
            )
          }
          id={attributes.name}
          multiple={additionalConfig['multiple']}
        />
        <label htmlFor={attributes.name} className="input-label-wrapper">
          <p style={{ paddingStart: 5 }}>{attributes.label}</p>
          <i className="fas fa-image"></i>
        </label>
      </div>
    );
  };

  getImgurl = item => {
    return !isEmpty(item['base64Data']) ? item['base64Data'] : item['url'];
  };

  renderImages = attributes => {
    const value = attributes.value;
    const images = this.state.images;

    let data = [];
    if (!isEmpty(images) && _.some(images, 'url')) {
      _.forEach(images, image => {
        data.push({
          url: image['url'],
        });
      });
    } else if (
      !isEmpty(value) &&
      (_.some(value, 'url') || _.some(value, 'base64Data'))
    ) {
      _.forEach(value, image => {
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
              onClick={() =>
                this.props.handleOpenImageModal({
                  label: attributes['label'],
                  url: item.url,
                })
              }
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
        <div className="image-content-wrapper">{this.renderImageUI()}</div>
        {this.renderImages(attributes)}
      </div>
    );
  }
}
