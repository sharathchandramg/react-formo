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
import { compileExpression } from 'filtrex';

export function getDefaultValue(field) {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'email':
    case 'password':
    case 'url':
    case 'phone':
    case 'location':
    case 'auto-incr-number':
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
    case 'auto-incr-number':
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
      case 'auto-incr-number':
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

export const getGeoLocation = (options, cb) => {
  let highAccuracySuccess = false;
  let highAccuracyError = false;
  let highAccuracy =
    !options || options.highAccuracy === undefined
      ? true
      : options.highAccuracy;
  let timeout =
    !options || options.timeout === undefined ? 20000 : options.timeout;

  let getLowAccuracyPosition = () => {
    console.log('REQUESTING POSITION', 'HIGH ACCURACY FALSE');
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('POSITION NETWORK OK', position);
        cb(position.coords);
      },
      error => {
        console.log(error);
        cb(null, error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maxAge: 0,
      }
    );
  };

  if (highAccuracy) {
    console.log('REQUESTING POSITION', 'HIGH ACCURACY TRUE');
    const watchId = navigator.geolocation.watchPosition(
      position => {
        // location retrieved
        highAccuracySuccess = true;
        console.log('POSITION GPS OK', position);
        navigator.geolocation.clearWatch(watchId);
        cb(position.coords);
      },
      error => {
        console.log(error);
        highAccuracyError = true;
        navigator.geolocation.clearWatch(watchId);
        getLowAccuracyPosition();
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maxAge: 0,
      }
    );

    setTimeout(() => {
      if (!highAccuracySuccess && !highAccuracyError) {
        getLowAccuracyPosition();
      }
    }, timeout);
  }
};

/**
 * Compile the expression, if result is false then return the default value
 * else return the compiled expression value
 */
const calculateConditionalMatch = (expressions, values, defaultValue) => {
  for (const expr of expressions) {
    const fn = compileExpression(expr);
    const result = fn(values);
    if (result !== 'false') {
      return result;
    }
  }
  return !isEmpty(values) ? defaultValue : null;
};

const calculateExpr = (type, expressions, values, defaultValue) => {
  switch (type) {
    case 'conditional_match':
      return calculateConditionalMatch(expressions, values, defaultValue);
    default:
      return null;
  }
};

/**
 * Check field has expr_field key, else return empty array
 * Expr field shoudl have stmt, expr_type and dependant_fields, if any is not there then throw empty,
 * otherwise calculate the values
 */
export const customFieldCalculations = (field, fieldValue, allFields) => {
  const exprFieldNames =
    !isEmpty(field) && !isEmpty(field['expr_field']) ? field['expr_field'] : [];
  const res = [];

  for (let i = 0; i < exprFieldNames.length; i++) {
    const exprField = allFields[exprFieldNames[i]];

    const additionalConfig =
      !isEmpty(exprField) && !isEmpty(exprField['additional_config'])
        ? exprField['additional_config']
        : null;

    if (isEmpty(additionalConfig)) return res;

    const acExpr =
      !isEmpty(additionalConfig) && !isEmpty(additionalConfig['expr'])
        ? additionalConfig['expr']
        : null;

    if (isEmpty(acExpr)) return res;

    const acExprDF =
      !isEmpty(acExpr) && !isEmpty(acExpr['dependant_fields'])
        ? acExpr['dependant_fields']
        : [];

    const acExprStmt =
      !isEmpty(acExpr) && !isEmpty(acExpr['stmt']) ? acExpr['stmt'] : [];

    const acExprType =
      !isEmpty(acExpr) && !isEmpty(acExpr['expr_type'])
        ? acExpr['expr_type']
        : '';

    const defaultValue =
      !isEmpty(acExpr) && !isEmpty(acExpr['defaultValue'])
        ? acExpr['defaultValue']
        : null;

    if (isEmpty(acExprDF) || isEmpty(acExprStmt)) return res;

    let dfValues = {};

    for (const fieldName of acExprDF) {
      const dfObj = allFields[fieldName];
      const dfObjValue =
        !isEmpty(dfObj) && !isEmpty(dfObj['value']) ? dfObj['value'] : null;
      const value =
        field['name'] === fieldName
          ? fieldValue
          : !isEmpty(dfObjValue)
          ? dfObjValue
          : null;
      if (!isEmpty(value)) dfValues[fieldName] = value;
    }

    const updatedValue = calculateExpr(
      acExprType,
      acExprStmt,
      dfValues,
      defaultValue
    );
    res.push({ ...exprField, value: updatedValue });
  }
  return res;
};
