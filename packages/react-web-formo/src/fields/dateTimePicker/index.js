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
          fontSize: 16,
          outline: 'none',
          opacity: this.props.disabled ? 0.5 : 1,
        }}
        disabled={this.props.disabled}
        value={this.props.value}
        onClick={this.props.onClick}
        onChange={this.props.onChange}
      />
    );
  }
}

export default class DateTimePicker extends Component {
  handleChange = date => {
    const data = moment(date)
      .utc()
      .valueOf();
    this.props.updateValue(this.props.attributes.name, data);
  };

  dateFormatter = date => {
    switch (date) {
      case 'today':
        return new Date();
      case 'tomorrow':
        return new Date(moment().add(1, 'days'));
      case 'yesterday':
        return new Date(moment().subtract(1, 'days'));
      default:
        if (!isNaN(date)) {
          return new Date(parseInt(date) * 1000);
        } else {
          return new Date();
        }
    }
  };

  showDatePicker = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={attributes.value ? new Date(attributes.value) : null}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
        onChange={date => this.handleChange(date)}
        dateFormat="do MMM yyyy"
      />
    );
  };

  showTimePicker = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={attributes.value ? new Date(attributes.value) : null}
        onChange={date => this.handleChange(date)}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="hh:mm a"
      />
    );
  };

  showDateTimePicker = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <DatePicker
        customInput={<CustomInput />}
        selected={attributes.value ? new Date(attributes.value) : null}
        onChange={date => this.handleChange(date)}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
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
          <p style={{ fontSize: 20, margin: 0 }}>
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
        <div style={{ display: 'flex' }}>{this.renderDateTimePicker()}</div>
      </div>
    );
  }
}
