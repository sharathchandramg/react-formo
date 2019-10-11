import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      value: null,
    };
  }

  handleChange = event => {
    let val = event.target.value;
    this.setState({ value: val });
    this.props.updateValue(this.props.attributes.name, val);
  };

  getLabel = () => {
    const { attributes } = this.props;
    let label = 'None';
    if (!isEmpty(attributes['value'])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes['value'].map(obj => {
          const labelKey = attributes.objectType
            ? obj[attributes.labelKey]
            : obj;
          return labelKey;
        });
        if (labelKeyArr.length) {
          label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        label = attributes.objectType
          ? attributes['value'][attributes.labelKey]
          : attributes['value'];
      }
    }
    return label;
  };

  renderLookupData = () => {
    const { attributes } = this.props;
    return (
      <div className="lookup-data-wrapper">
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        {this.getLabel()}
        <i className="fal fa-angle-right"></i>
      </div>
    );
  };

  renderOptions = () => {
    const { attributes } = this.props;
    return (
      <div className="lookup-options-wrapper">
        {attributes.options.length > 0 &&
          attributes.options.map((item, index) => {
            return (
              <div key={index} className="lookup-options-value">
                {item[attributes.labelKey]}
              </div>
            );
          })}
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="lookup-wrapper">
        {this.renderLookupData()}
        {this.renderOptions()}
      </div>
    );
  }
}
