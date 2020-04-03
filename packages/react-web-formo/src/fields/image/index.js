import React, { Component } from 'react';
import './style.css';
import { isEmpty } from '../../utils/validators';
import _ from 'lodash';
import imageCompression from 'browser-image-compression';

export default class ImageField extends Component {
  constructor(props) {
    super(props);
    this.isLocal = false;
    this.isFirstTime = true;
    this.state = {
      imageArray: undefined,
    };
  }

  componentDidMount() {
    this.isLocal = false;
    this.isFirstTime = true;
  }

  componentDidUpdate(prevProps) {
    if (this.isFirstTime && !this.isLocal) {
      const { handleDocumentUpdateAndDownload, attributes } = this.props;
      const { value } = attributes;
      if (
        typeof handleDocumentUpdateAndDownload === 'function' &&
        !isEmpty(value)
      ) {
        handleDocumentUpdateAndDownload(
          attributes,
          value,
          (actionType = 'read')
        );
        this.isFirstTime = false;
      }
    }
  }

  setImageData = images => {
    const {
      attributes,
      updateValue,
      handleDocumentUpdateAndDownload,
    } = this.props;
    this.setState(
      {
        imageArray: images,
      },
      () => {
        this.isLocal = true;
        updateValue(attributes.name, images);
      }
    );

    if (typeof handleDocumentUpdateAndDownload === 'function') {
      handleDocumentUpdateAndDownload(
        attributes,
        images,
        (actionType = 'write')
      );
    }
  };

  getImageConfiguration = () => {
    const { additional_config } = this.props.attributes;
    let mode = 'low-resolution';
    let multiple = false;
    let config = null;
    let maxFiles = 1;

    if (!isEmpty(additional_config)) {
      mode = additional_config['mode'] || 'low-resolution';
      multiple = additional_config['multiple'] || false;
      maxFiles = multiple ? additional_config['max_files'] || 5 : 2;
    }
    if (!isEmpty(mode) && mode.match(/high-resolution/i)) {
      // you should provide one of maxSizeMB, maxWidthOrHeight in the options
      config = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        mode: mode,
        multiple: multiple,
        maxFiles: maxFiles,
      };
    } else {
      // you should provide one of maxSizeMB, maxWidthOrHeight in the options
      config = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 360,
        useWebWorker: true,
        mode: mode,
        multiple: multiple,
        maxFiles: maxFiles,
      };
    }
    return config;
  };

  compressImage = async (imageFile, config) => {
    const compressedFile = await imageCompression(imageFile, config);
    return compressedFile;
  };

  handleImagePicker = async event => {
    const files = event.target.files;
    const config = this.getImageConfiguration();
    const { maxFiles } = config;
    if (files.length <= maxFiles) {
      let promises = _.map(files, async file => {
        const output = await this.compressImage(file, config);
        const imageobj = {};
        imageobj['file_path'] = URL.createObjectURL(output);
        imageobj['mime_type'] = output['type'];
        imageobj['base64_data'] = await imageCompression.getDataUrlFromFile(
          file
        );
        imageobj['size'] = (output.size / 1024 / 1024).toFixed(2);
        imageobj['blob'] = output;
        return imageobj;
      });

      promises = _.filter(
        promises,
        p => typeof p !== 'undefined' && p !== null
      );
      const images = await Promise.all(promises);

      if (!isEmpty(images)) {
        this.setImageData(images);
      }
    }
  };

  renderImageItem = item => {
    return (
      <div className="img-wrapper" key={item['uri']}>
        <img src={item['uri']} alt="image" />
      </div>
    );
  };

  renderImageList = images => {
    if (!isEmpty(images)) {
      return images.map(image => this.renderImageItem(image));
    }
    return null;
  };

  renderLabel = () => {
    return (
      <div className="image-data-wrapper">
        <div className="image-input-wrapper">
          <label>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              multiple={true}
              onChange={e => this.handleImagePicker(e)}
            />
            <span className="file-custom">
              <h6>Choose file</h6>
              <h6>Browse</h6>
            </span>
          </label>
        </div>
      </div>
    );
  };

  renderPreview = attributes => {
    const value = attributes.value;
    const imageArray = this.state.imageArray;
    let data = [];
    if (!isEmpty(imageArray) && _.some(imageArray, 'file_path')) {
      _.forEach(imageArray, image => {
        data.push({
          uri: image['file_path'],
        });
      });
    } else if (!isEmpty(value) && _.some(value, 'url')) {
      _.forEach(value, image => {
        data.push({
          uri: image['url'],
          headers: {
            'content-type': image['contentType'] || image['mime_type'],
          },
        });
      });
    }

    return (
      <React.Fragment>
        <div className="lookup-content-wrapper"> {this.renderLabel()} </div>
        {data && data.length ? (
          <div className="img-list-wrapper">{this.renderImageList(data)} </div>
        ) : null}
      </React.Fragment>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="container-wrapper">
        <div className="label-wrapper">
          <div className="label-text">
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        {this.renderPreview(attributes)}
      </div>
    );
  }
}
