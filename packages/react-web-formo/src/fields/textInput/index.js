import React, { Component } from 'react';
import './style.css';

export default class TextInputField extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    const inputElement = this.inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('wheel', this.handleWheel);
    }
  }

  componentWillUnmount() {
    const inputElement = this.inputRef.current;

    if (inputElement) {
      inputElement.removeEventListener('wheel', this.handleWheel);
    }
  }

  handleWheel = (event) => {
    event.preventDefault();
  };

  handleChange = (event) => {
    const { value } = event.target;
    const { type } = this.props.attributes;

    // Validate only if the input type is 'number'
    if (type === 'number' && !/^[-]?\d*\.?\d*$/.test(value)) {
      return;
    }

    this.props.updateValue(this.props.attributes.name, value);
  };

  render() {
    const { attributes } = this.props;
    const disableCondition =
      !attributes.editable ||
      (attributes['type'] === 'auto-incr-number' && !attributes.editable);
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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <p style={{ fontSize: 20, margin: 0 }}>
            {attributes.label} {attributes.required ? '*' : ''} :
          </p>
          {attributes.error && (
            <p id="error" style={{ color: 'red', fontSize: 12, margin: 0 }}>
              {attributes.errorMsg}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', height: 45 }}>
          <input
            type={attributes.type === 'number' ? 'text' : attributes.type}
            value={
              attributes['value'] || attributes['value'] === 0
                ? attributes['value']
                : ''
            }
            id={attributes['name']}
            disabled={disableCondition}
            style={{
              width: '100%',
              border: '1px solid #979797',
              borderRadius: 5,
              padding: 5,
              fontSize: 16,
              outline: 'none',
              opacity: disableCondition ? 0.5 : 1,
            }}
            onChange={this.handleChange}
            className="formo-text"
            ref={this.inputRef}
          />
        </div>
      </div>
    );
  }
}
