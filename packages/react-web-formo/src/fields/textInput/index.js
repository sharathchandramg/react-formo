import React, { Component } from 'react';

export default class TextInputField extends Component {
  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  render() {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
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
        <div style={{ display: 'flex', height: 45 }}>
          <input
            type={attributes['type']}
            value={attributes['value']}
            id={attributes['name']}
            disabled={disableCondition}
            style={{
              width: '100%',
              border: '1px solid #979797',
              borderRadius: 5,
              padding: 5,
              fontSize: 20,
              outline: 'none',
              opacity: disableCondition ? 0.5 : 1,
            }}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
