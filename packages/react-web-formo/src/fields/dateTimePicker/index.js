import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

class CustomInput extends Component {
  render() {
    return (
      <input
        style={{
          width: '100%',
          height: 40,
          border: '1px solid #979797',
          borderRadius: 5,
          padding: 5,
          fontSize: 20,
          outline: 'none',
        }}
        value={this.props.value}
        onClick={this.props.onClick}
        onChange={this.props.onChange}
      />
    );
  }
}

export default class DateTimePicker extends Component {
  state = {
    value: null,
  };

  componentDidMount() {
    this.setDateValue();
  }

  componentDidUpdate() {
    if (this.state.value !== this.props.attributes.value) {
      this.setDateValue();
    }
  }

  setDateValue = () => {
    const value = this.props.attributes.value
      ? new Date(this.props.attributes.value)
      : null;

    this.handleChange(value);
  };

  handleChange = date => {
    this.setState({ value: date });
    this.props.updateValue(this.props.attributes.name, date);
  };

  showDatePicker = () => {
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={this.state.value}
        onChange={date => this.handleChange(date)}
        dateFormat="do MMM yyyy"
      />
    );
  };

  showTimePicker = () => {
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={this.state.value}
        onChange={date => this.handleChange(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="hh:mm a"
      />
    );
  };

  showDateTimePicker = () => {
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={this.state.value}
        onChange={date => this.handleChange(date)}
        showTimeSelect
        timeFormat="hh:mm a"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="do MMM yyyy hh:mm a"
      />
    );
  };

  renderDateTimePicker = () => {
    const { attributes } = this.props;
    let openPicker;

    switch (attributes.mode) {
      case 'datetime':
        openPicker = this.showDateTimePicker();
        break;
      case 'date':
        openPicker = this.showDatePicker();
        break;
      case 'time':
        openPicker = this.showTimePicker();
        break;
      default:
        openPicker = this.showDateTimePicker();
        break;
    }

    return openPicker;
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
        <div style={{ display: 'flex' }}>{this.renderDateTimePicker()}</div>
      </div>
    );
  }
}
