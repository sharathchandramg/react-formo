import React, { Component } from 'react';

export default class PickerField extends Component {
  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  renderWebPicker = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <select
        style={{
          width: '100%',
          height: 45,
          fontSize: 20,
          backgroundColor: '#ffffff',
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
          <p style={{ fontSize: 16, margin: 0 }}>
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
        <div>{this.renderWebPicker()}</div>
      </div>
    );
  }
}
