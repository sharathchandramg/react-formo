import React, { Component } from 'react';
import './style.css';

export default class StatusPickerField extends Component {
  handleChange = (event) => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  renderWebPicker = () => {
    const { attributes } = this.props;
    const disableCondition = !attributes.editable;

    return (
      <div className="status-picker-wrap">
        <select
          className={`status-picker-select ${
            attributes.show_first_option ? 'status-picker-transparent' : ''
          }`}
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

        {attributes.show_first_option && attributes.value ? (
          <span className="status-picker-overlay">{attributes.value}</span>
        ) : null}
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
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
            <p id="error" className="status-picker-error">
              {attributes['errorMsg']}
            </p>
          )}
        </div>
        <div>{this.renderWebPicker()}</div>
      </div>
    );
  }
}
