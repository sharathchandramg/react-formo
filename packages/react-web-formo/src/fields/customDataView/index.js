import React, { Component } from 'react';
import './style.css';

export default class CustomDataComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleOnclick = () => {
    if (typeof this.props.onCustomDataView === 'function') {
      this.props.onCustomDataView(this.props);
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

  renderCatalogUI = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div
        className={`catalog-data-wrapper ${disableCondition ? 'disabled' : ''}`}
        onClick={() => this.handleOnclick()}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getLabel(attributes.value)}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="catalog-root">
        <div className="catalog-label-wrapper">
          <div className="catalog-label-text">
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="catalog-content-wrapper">{this.renderCatalogUI()}</div>
      </div>
    );
  }
}
