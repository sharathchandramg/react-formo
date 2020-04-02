import _ from 'lodash';
import {
  isEmail,
  isEmpty,
  validateMobileNumber,
  isNull,
  isValidNumber,
  isValidUrl,
} from './validators';
import moment from 'moment';

export function getKeyboardType(textType) {
  switch (textType) {
    case 'email':
      return 'email-address';

    case 'number':
    case 'phone':
    case 'currency':
      return 'numeric';

    default:
      return 'default';
  }
}

export function getDefaultValue(field) {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'email':
    case 'password':
    case 'url':
    case 'phone':
    case 'location':
      return field.defaultValue || '';

    case 'currency':
      let curr_type = field.defaultCurrency
        ? field.defaultCurrency
        : field.currencyOptions
        ? field.currencyOptions[0]
        : '';
      let curr_value = field.defaultValue ? field.defaultValue : '';
      return { curr_value: curr_value, curr_type: curr_type };

    case 'calculated':
      return field.defaultValue || '';

    case 'status_picker':
    case 'picker': {
      if (field.options.indexOf(field.defaultValue) !== -1) {
        return field.defaultValue;
      }
      return field.options[0];
    }
    case 'lookup':
    case 'select': {
      if (Array.isArray(field.defaultValue)) {
        const selected = [];
        if (!field.objectType) {
          field.defaultValue.forEach(item => {
            if (field.options.indexOf(item) !== -1) {
              selected.push(item);
            }
          });
        } else {
          field.defaultValue.forEach(item => {
            if (
              field.options.findIndex(
                option => option[field.primaryKey] === item[field.primaryKey]
              ) !== -1
            ) {
              selected.push(item);
            }
          });
        }
        return selected;
      }
      if (!field.multiple) {
        return field.defaultValue || null;
      }
      return [];
    }

    case 'switch':
      if (typeof field.defaultValue === 'boolean') {
        return field.defaultValue;
      }
      return false;

    case 'date': {
      switch (field.mode) {
        case 'date':
        case 'time':
        case 'datetime':
          if (field.defaultValue === 'today')
            return moment()
              .utc()
              .valueOf();
          else if (field.defaultValue === 'tomorrow')
            return moment()
              .add(1, 'day')
              .utc()
              .valueOf();
          else if (field.defaultValue === 'yesterday')
            return moment()
              .subtract(1, 'day')
              .utc()
              .valueOf();
          else if (
            typeof field.defaultValue !== 'undefined' &&
            !_.isNaN(field.defaultValue)
          ) {
            return moment()
              .add(parseInt(field.defaultValue), 'minutes')
              .utc()
              .valueOf();
          } else if (field.defaultValue === '') {
            return 'Select';
          } else return null;
      }
    }
    case 'group':
      if (field.fields) {
        return field.defaultValue;
      }
      return null;

    case 'simple-grid':
    case 'customDataView': {
      if (typeof field.defaultValue === 'object' && field.defaultValue) {
        return field.defaultValue;
      }
      return {};
    }

    case 'checklist':
      return null;

    default:
      return null;
  }
}

export function getResetValue(field) {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'email':
    case 'password':
    case 'url':
    case 'phone':
    case 'currency':
    case 'location':
      return null;

    case 'picker':
    case 'status_picker': {
      if (field.options.indexOf(field.defaultValue) !== -1) {
        return field.defaultValue;
      }
      return field.options[0];
    }

    case 'select':
    case 'lookup':
      return field.multiple ? [] : null;

    case 'switch':
      return false;

    case 'date':
      return null;

    case 'simple-grid':
    case 'customDataView': {
      if (typeof field.defaultValue === 'object' && field.defaultValue) {
        return field.defaultValue;
      }
      return {};
    }

    case 'checklist':
      return null;

    default:
      return null;
  }
}

export function getInitialState(fields) {
  const state = {};
  _.forEach(fields, field => {
    const fieldObj = field;
    fieldObj.error = false;
    fieldObj.errorMsg = '';
    if (field && field.type) {
      fieldObj.value = getDefaultValue(field);
      state[field.name] = fieldObj;
    }
  });
  return state;
}

export function autoValidate(field) {
  let error = false;
  let errorMsg = '';

  if (field.required) {
    switch (field.type) {
      case 'email':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!isEmail(field.value)) {
          error = true;
          errorMsg = 'Please enter a valid email';
        }
        break;
      case 'text':
      case 'location':
      case 'image':
      case 'password':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'currency':
        if (isEmpty(field.value.curr_value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'number':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!isValidNumber(field.value)) {
          error = true;
          errorMsg = `${field.label} should be a number`;
        }

        break;

      case 'phone':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!validateMobileNumber(field.value)) {
          error = true;
          errorMsg = `${field.label} should be valid mobile number`;
        }
        break;

      case 'url':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!isValidUrl(field.value)) {
          error = true;
          errorMsg = `${field.label} should be valid url`;
        }
        break;

      case 'date':
        if (isNull(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'picker':
      case 'status_picker':
        if (isEmpty(field.value) || field.value === '-Select-') {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'sub-form':
        if (
          typeof field.value === 'undefined' ||
          !field.value ||
          field.value[0] === ''
        ) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'lookup':
      case 'select':
      case 'checklist':
        if (
          typeof field.value === 'undefined' ||
          !field.value ||
          field.value[0] === '{}'
        ) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'simple-grid':
      case 'customDataView':
        if (
          typeof field.value !== 'object' ||
          !field.value ||
          isEmpty(field.value)
        ) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;
      default:
    }
  }
  return { error, errorMsg };
}
