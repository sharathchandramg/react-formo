import React, { Component } from 'react';

import './style.css';

export default class PickerField extends Component {
  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  renderWebPicker = () => {
    const { attributes } = this.props;
    const disableCondition =
    (this.props.formSubmissionType === 'create' && !attributes.editable) ||
    (this.props.formSubmissionType === 'update' && !attributes.editable);
    return (
      <select
        style={{
          width: '100%',
          height: 45,
          fontSize: 16,
          borderRadius: '5px',
        }}
        value={attributes.value}
        onChange={this.handleChange}
        disabled={disableCondition}
      >
        {attributes.options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  };

  renderOptionsAsList = () => {
    const { attributes } = this.props;
    return (
      <div className="options-wrapper">
        {attributes.options.length > 0 &&
          attributes.options
            .slice(1, attributes.options.length)
            .map((item, index) => {
              return (
                <div className="value-wrapper" key={`picker-${index}`}>
                  <input
                    type="radio"
                    id={`${this.props.attributes.name}-${item}`}
                    name={attributes.name}
                    value={item}
                    checked={attributes.value === item}
                    onChange={() =>
                      this.props.updateValue(this.props.attributes.name, item)
                    }
                  />
                  <label
                    htmlFor={`${this.props.attributes.name}-${item}`}
                    className="option-label"
                  >
                    {item}
                  </label>
                </div>
              );
            })}
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <p style={{ fontSize: 20, margin: 0 }}>
            {attributes['label']} {attributes['required'] ? `*` : ''} :
          </p>
          {attributes['error'] && (
            <p
              id="error"
              style={{
                color: 'red',
                fontSize: 12,
                margin: 0,
              }}
            >
              {attributes['errorMsg']}
            </p>
          )}
        </div>
        <div>
          {attributes &&
          attributes['additional_config'] &&
          attributes['additional_config']['show_inline']
            ? this.renderOptionsAsList()
            : this.renderWebPicker()}
        </div>
      </div>
    );
  }
}
