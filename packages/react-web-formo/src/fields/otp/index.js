import React, { Component } from 'react';
import './style.css';

class OtpInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      error: '',
      timer: 0,
      otpSent: false // New state variable to track if OTP has been sent
    };
    this.interval = null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.timer !== prevState.timer && this.state.timer > 0) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer = () => {
    this.clearTimer();
    this.interval = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer - 1 }));
    }, 1000);
  }

  clearTimer = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handleSendOtp = () => {
    console.log('OTP sent to:', this.props.referenceData);
    this.setState({ timer: 20, otpSent: true });
    
    // Validate OTP here
    if (this.state.otp !== '1234') {
      this.setState({ error: 'Incorrect OTP. Retry.' });
    } else {
      this.setState({ error: '' });
      console.log('OTP verified!');
    }
  };

  setOtp = (e) => {
    this.setState({ otp: e.target.value, error: '' }); // Reset error on OTP change
  }

  render() {
    const { otp, error, timer, otpSent } = this.state;

    return (
      <div className="otp-root">
        <div className="otp-label-wrapper">
          <p>OTP verification</p>
        </div>
        <div className="otp-content-wrapper">
          <input
            type="text"
            className="otp-input"
            value={otp}
            onChange={this.setOtp} // Handle OTP input change
            placeholder="Enter OTP"
          />
          <button 
            className="send-button" 
            onClick={this.handleSendOtp} 
            disabled={timer > 0}
          >
            {otpSent ? 'Resend' : 'Send OTP'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }
}

export default OtpInput;
