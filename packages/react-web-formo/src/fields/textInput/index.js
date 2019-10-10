import React, { Component } from 'react';

export default class TextInputField extends Component {
  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
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
          <div
            style={{
              width: '30%',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            {attributes['required'] && (
              <p style={{ fontSize: 16, margin: 0 }}>
                {attributes['label']} * :
              </p>
            )}
            {!attributes['required'] && (
              <p style={{ fontSize: 16, margin: 0 }}>{attributes['label']}:</p>
            )}
          </div>
          <div
            style={{
              width: '70%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
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
        </div>
        <div style={{ display: 'flex' }}>
          <input
            type={attributes['type']}
            value={attributes['value']}
            id={attributes['name']}
            style={{
              width: '100%',
              height: 40,
              border: '1px solid #979797',
              borderRadius: 5,
              padding: 5,
              fontSize: 20,
              outline: 'none',
            }}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}
