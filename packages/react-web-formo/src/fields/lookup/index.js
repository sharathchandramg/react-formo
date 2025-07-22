import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnclick = () => {
    if (typeof this.props.renderComponent === 'function') {
      this.props.renderComponent(this.props);
    }
    return;
  };

  getSelectedValue = () => {
    const { attributes } = this.props;
    let value = 'None';
    if (!isEmpty(attributes['value'])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes['value'].map((obj) => {
          const labelKey = attributes.objectType
            ? obj[attributes.labelKey]
            : obj;
          return labelKey;
        });
        if (labelKeyArr.length) {
          value = `${labelKeyArr.length} Selected`;
        }
      } else {
        const selectedValue = attributes.objectType
          ? attributes['value'][attributes.labelKey]
          : attributes['value'];
        if (selectedValue && selectedValue !== 'None') {
          value = '1 Selected';
        }
      }
    }
    return value;
  };

  renderLookupUI = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div
        className={`lookup-data-wrapper ${disableCondition ? 'disabled' : ''}`}
        onClick={() => this.handleOnclick()}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getSelectedValue()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="lookup-wrapper">
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
        <div className="lookup-content-wrapper">{this.renderLookupUI()}</div>
      </div>
    );
  }
}
