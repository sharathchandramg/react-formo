import React, { Component } from 'react';
import './style.css';

export default class TextInputField extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      errorMsg: '', // Store dynamically generated error message
    };
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
    const { attributes } = this.props;
    const { additional_config = {} } = attributes;
    const { allow_decimal, allow_negative,max,min } = additional_config;
    console.log(additional_config,"CONFIG")
    let inputValue = event.target.value;

    if (allow_decimal === undefined && allow_negative === undefined) {
      this.props.updateValue(attributes.name, inputValue);
      return;
    }

    const { valid, errorMsg } = this.isValidInput(
      inputValue,
      allow_decimal,
      allow_negative
    );

    if (!valid) {
      this.setState({ errorMsg }); // Set dynamic error message
      return;
    }

    // Clear any previous error message if input is valid
    this.setState({ errorMsg: '' });
    this.props.updateValue(attributes.name, inputValue);
  };

  isValidInput = (value, allow_decimal, allow_negative,min,max) => {
    if (allow_decimal && !allow_negative) {
      if (!/^(\d*\.?\d*)$/.test(value)) {
        return { valid: false, errorMsg: 'Negative not allowed' };
      }
    }

    if (!allow_decimal && allow_negative) {
      if (!/^-?\d*$/.test(value)) {
        return { valid: false, errorMsg: 'Decimal not allowed' };
      }
    }

    if (!allow_decimal && !allow_negative) {
      if (!/^\d*$/.test(value)) {
        return { valid: false, errorMsg: 'Negative and decimal not allowed' };
      }
    }

    if (allow_decimal && allow_negative) {
      if (!/^-?\d*\.?\d*$/.test(value)) {
        return { valid: false, errorMsg: 'Invalid input' };
      }
    }

    return { valid: true, errorMsg: '' };
  };

  render() {
    const { attributes } = this.props;
    const { errorMsg } = this.state; // Get dynamic error message from state

    const disableCondition =
      !attributes.editable ||
      (attributes['type'] === 'auto-incr-number' && !attributes.editable) ||
      (attributes && attributes['expression']);

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
            {attributes['label']} {attributes['required'] ? '*' : ''} :
          </p>
        

        {attributes['errorMsg'] && (
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
    
       
        {errorMsg && (
          <p
            id="error"
            style={{
              color: 'red',
              fontSize: 12,
              margin:0,
            }}
          >
            {errorMsg}
          </p>
        )}

        </div>
  
        <div style={{ display: 'flex', height: 45 }}>
          <input
            type={attributes['type']}
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
