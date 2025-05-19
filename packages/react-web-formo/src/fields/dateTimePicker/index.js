import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

export default class DateTimePicker extends Component {
  handleChange = (date) => {
    const data = moment(date).utc().valueOf();
    this.props.updateValue(this.props.attributes.name, data);
  };

  dateFormatter = (date) => {
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
    const disableCondition = !attributes.editable;
    return (
      <DatePicker
        selected={attributes.value ? new Date(attributes.value) : null}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
        onChange={(date) => this.handleChange(date)}
        dateFormat="do MMM yyyy"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    );
  };

  showTimePicker = () => {
    const { attributes } = this.props;
    const disableCondition = !attributes.editable;
    return (
      <DatePicker
        selected={attributes.value ? new Date(attributes.value) : null}
        onChange={(date) => this.handleChange(date)}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        timeFormat={this.props.attributes.is_24hour ? 'HH:mm' : 'hh:mm a'}
        dateFormat={this.props.attributes.is_24hour ? 'HH:mm' : 'hh:mm a'}
      />
    );
  };

  showDateTimePicker = () => {
    const { attributes } = this.props;
    const disableCondition = !attributes.editable;
    return (
      <DatePicker
        selected={attributes.value ? new Date(attributes.value) : null}
        onChange={(date) => this.handleChange(date)}
        disabled={disableCondition}
        minDate={attributes.minDate && this.dateFormatter(attributes.minDate)}
        maxDate={attributes.maxDate && this.dateFormatter(attributes.maxDate)}
        showTimeSelect
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        timeFormat={this.props.attributes.is_24hour ? 'HH:mm' : 'hh:mm a'}
        timeIntervals={15}
        timeCaption="Time"
        dateFormat={
          this.props.attributes.is_24hour
            ? 'do MMM yyyy HH:mm'
            : 'do MMM yyyy hh:mm a'
        }
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
        className="formo-date-wrapper"
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
