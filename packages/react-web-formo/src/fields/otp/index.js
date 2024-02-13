import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from './../../utils/validators';
import './style.css';

class OtpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      timer: 0,
      otpSent: false,
      isFocused: false,
      refFieldValue: ""
    };
    this.interval = null;
  }  

  startTimer = () => {
    this.clearTimer();
    this.interval = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer - 1 }));
    }, 1000);
  };

  clearTimer = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  getInputValue = () => {
    const { attributes } = this.props;
    return !isEmpty(attributes) && !isEmpty(attributes["value"]);
  };

  handleChange = (event) => {
    const { value } = event.target;
    if (this.props.updateValue) {
      this.props.updateValue(this.props.attributes.name, value);
    }
  };

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  
  getRefFieldValue = (attributes) => {
    const refField = attributes && attributes.additional_config && attributes.additional_config.ref_field;

    if (!refField) {
        return null;
    }

    const stateValue = this.props.state[refField] && this.props.state[refField].value;
    const refDataValue = this.props.refData && this.props.refData[refField];

    return stateValue || refDataValue;
};


handleChangeGetotp = (attributes) => () => {
  const refValue = this.getRefFieldValue(attributes);
  this.props.getOtpByRefData(
    {
      ...attributes,
      ref_value: !isEmpty(refValue) ? refValue : null,
      ref_value_type: !isEmpty(refValue)
        ? refValue.includes("@")
          ? "EMAIL"
          : "PHONE"
        : null,
    },
    this.callInitTimer
  );
};

;

  getLabel = (attributes) => {
    const refFieldValue = this.getRefFieldValue(attributes);
    return refFieldValue
      ? `${attributes.label}- ${refFieldValue}`
      : attributes.label;
  };

  callInitTimer = () => {
    this.setState({
      disableBtn: true,
      btnText: "Resend",
      btnCounter: 60,
    });
    this.initTimer();
  };

  initTimer = () => {
    this.intervalId = setInterval(this.timer, 1000);
  };

  timer = () => {
    this.setState(prevState => {
      if (prevState.btnCounter === 0) {
        clearInterval(this.intervalId);
        return { disableBtn: false };
      } else {
        return { btnCounter: prevState.btnCounter - 1 };
      }
    });
  };

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  

  renderLabel = () => {
    const { otp, isFocused } = this.state;
    const labelClass = otp || isFocused ? "label label-float" : "label";
    return (
      <label htmlFor="otpInput" className={labelClass}>
        {this.getLabel(this.props.attributes)}
      </label>
    );
  };

  renderInputField = () => {
    const { otp } = this.state;
    return (
      <input
        id="otpInput"
        type="text"
        className="otp-input"
        value={this.props.attributes['value']}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  };

  render() {
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
          }}
        >
          <p style={{ fontSize: 20, margin: 0 }}>
           {this.renderLabel()}
          </p>
          {this.props.attributes['error'] && (
            <p
              id="error"
              style={{
                color: 'red',
                fontSize: 12,
                margin: 0,
              }}
            >
              {this.props.attributes['errorMsg']}
            </p>
          )}
           {!this.props.attributes['error'] && (
            <p
              id="error"
              style={{
                color: 'green',
                fontSize: 12,
                margin: 0,
              }}
            >
              {this.props.attributes['successMsg']}
            </p>
          )}
          
        </div>
        <div style={{ display: 'flex', height: 45 }}>
          {this.renderInputField(this.props.attributes)}
          <button style={{background:'#00acf1',color:'#ffffff',border:'#ffffff'}}
  onClick={this.handleChangeGetotp(this.props.attributes)}
  disabled={this.state.disableBtn}
>
  {this.state.disableBtn ? `Resend in ${this.state.btnCounter}s` : 'Get OTP'}
</button>
        </div>
      </div>
    );
  }
}

export default OtpInput;
