import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = ({ value, onClick, onChange }) => (
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
    value={value}
    onClick={onClick}
    onChange={onChange}
  />
);

export default class DateTimePicker extends Component {
  state = {
    value: null,
  };

  handleChange = event => {
    let val = event.target.value;
    this.setState({ value: val });
    this.props.updateValue(this.props.attributes.name, val);
  };

  showDatePicker = dateValue => {
    return (
      <DatePicker
        customInput={<CustomInput value={dateValue} />}
        selected={new Date()}
        onChange={date => this.handleChange(date)}
        dateFormat="do MMM yyyy"
      />
    );
  };

  showTimePicker = dateValue => {
    return (
      <DatePicker
        customInput={<CustomInput value={dateValue} />}
        selected={new Date()}
        onChange={date => this.handleChange(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat="hh:mm a"
      />
    );
  };

  showDateTimePicker = dateValue => {
    return (
      <DatePicker
        customInput={<CustomInput value={dateValue} />}
        selected={new Date()}
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
    const value = (attributes.value && moment(attributes.value)) || null;
    let dateValue, openPicker;

    switch (attributes.mode) {
      case 'datetime':
        dateValue = 'Select Date Time';
        dateValue = value && moment(value).format('do MMM yyyy hh:mm a');
        openPicker = this.showDateTimePicker(dateValue);
        break;
      case 'date':
        dateValue = 'Select Date';
        dateValue = value && moment(value).format('do MMM yyyy');
        openPicker = this.showDatePicker(dateValue);
        break;
      case 'time':
        dateValue = 'Select Time';
        dateValue = value && moment(value).format('hh:mm a');
        openPicker = this.showTimePicker(dateValue);
        break;
      default:
        dateValue = 'Select Date Time';
        dateValue = value && moment(value).format('do MMM yyyy hh:mm a');
        openPicker = this.showDateTimePicker(dateValue);
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
