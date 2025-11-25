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
    case 'longtext':
    case 'rating':
    case 'otp':
      return field.defaultValue || '';
    case 'cascading-dropdown':
      return '';

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
    case 'user_directory':
    case 'lookup': {
      if (Array.isArray(field.defaultValue)) {
        const selected = [];
        if (!field.objectType) {
          field.defaultValue.forEach((item) => {
            if (field.options.indexOf(item) !== -1) {
              selected.push(item);
            }
          });
        } else {
          field.defaultValue.forEach((item) => {
            if (
              field.options.findIndex(
                (option) => option[field.primaryKey] === item[field.primaryKey]
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

    case 'select':
      if (Array.isArray(field.defaultValue)) {
        const selected = [];
        if (!field.objectType) {
          field.defaultValue.forEach((item) => {
            if (field.options.indexOf(item) !== -1) {
              selected.push(item);
            }
          });
        } else {
          field.defaultValue.forEach((item) => {
            if (
              field.options.findIndex(
                (option) => option[field.primaryKey] === item[field.primaryKey]
              ) !== -1
            ) {
              selected.push(item);
            }
          });
        }
        return field.multiple ? selected : field.defaultValue[0];
      }
      if (!field.multiple) {
        return field.defaultValue || null;
      }
      return [];

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
          if (
            field.additional_config &&
            field.additional_config.data_source &&
            ['server'].includes(field.additional_config.data_source)
          ) {
            return null;
          } else {
            if (field.defaultValue === 'today') return moment().utc().valueOf();
            else if (field.defaultValue === 'tomorrow')
              return moment().add(1, 'day').utc().valueOf();
            else if (field.defaultValue === 'yesterday')
              return moment().subtract(1, 'day').utc().valueOf();
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
        case 'dayofweek':
        case 'dayofthemonth':
        case 'weekno':
        case 'monthno':
        case 'monthname':
        case 'year':
          if (
            field.additional_config &&
            field.additional_config.data_source &&
            ['server'].includes(field.additional_config.data_source)
          ) {
            return null;
          } else {
            return getDatePartValue(field.mode);
          }
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
    case 'longtext':
    case 'rating':
    case 'otp':
      return null;
    case 'cascading-dropdown':
      return '';

    case 'picker':
    case 'status_picker': {
      if (field.options.indexOf(field.defaultValue) !== -1) {
        return field.defaultValue;
      }
      return field.options[0];
    }

    case 'user_directory':
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
  _.forEach(fields, (field) => {
    const fieldObj = field;
    fieldObj.error = false;
    fieldObj.errorMsg = '';
    fieldObj.success = false;
    fieldObj.successMsg = '';
    if (field && field.type) {
      fieldObj.value = getDefaultValue(field);
      state[field.name] = fieldObj;
    }
  });
  return state;
}

export function autoValidate(field, data = {}) {
  let error = false;
  let errorMsg = '';
  let success = false;
  let successMsg = '';
  let invalidRef = false;

  if (field.type == 'email') {
    if (field.required && isEmpty(field.value)) {
      error = true;
      errorMsg = `${field.label} is required`;
    } else if (!isEmpty(field.value) && !isEmail(field.value)) {
      error = true;
      errorMsg = 'Please enter a valid email';
    }
    return { error, errorMsg };
  }
  if (field.type == 'phone') {
    if (field.required && isEmpty(field.value)) {
      error = true;
      errorMsg = `${field.label} is required`;
    } else if (!isEmpty(field.value) && !validateMobileNumber(field.value)) {
      error = true;
      errorMsg = `Please enter a valid phone number`;
    }
    return { error, errorMsg };
  }
  if (field.required) {
    switch (field.type) {
      case 'text':
      case 'location':
      case 'image':
      case 'password':
      case 'document':
      case 'signature':
      case 'rating':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'longtext':
        const additionalConfig = field['additional_config'];
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (
          !isEmpty(additionalConfig) &&
          !isEmpty(additionalConfig['max_length'])
        ) {
          if (
            field.value.trim().length > Number(additionalConfig['max_length'])
          ) {
            error = true;
            errorMsg = `Maximum characters allowed is ${additionalConfig['max_length']}`;
          }
        }
        break;

      case 'currency':
        if (isEmpty(field.value.curr_value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'auto-incr-number':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!isValidNumber(field.value)) {
          error = true;
          errorMsg = `${field.label} should be a number`;
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
        if (isEmpty(field.value) || field.value === '-Select-') {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'status_picker':
        if (
          (field['value'] && field['value'] === '-Select-') ||
          isEmpty(field['value']) ||
          (field['options'].length > 0 &&
            !isEmpty(field['value']) &&
            !field['options'].includes(field['value']))
        ) {
          error = true;
          errorMsg = `${field.label} is required`;
        }
        break;

      case 'cascading-dropdown':
        if (isEmpty(field.value)) {
          error = true;
          errorMsg = `${field.label} is required`;
        } else if (!isEmpty(field) && !isEmpty(field['value'])) {
          if (
            field.ref_field_name &&
            data &&
            data[field.ref_field_name] &&
            data[field.ref_field_name]['value']
          ) {
            const refField = data[field.ref_field_name];
            const refValue = refField['value'];
            const refFieldOption =
              refField.options && refField.options.length > 0 && refValue
                ? _.find(refField.options, { label: refValue })
                : null;
            const valueOption =
              field.options.length > 0 && field['value']
                ? _.find(field.options, { label: field['value'] })
                : null;
            const isValidOption =
              refFieldOption &&
              refFieldOption.id &&
              valueOption &&
              valueOption.ref_id.length > 0
                ? valueOption.ref_id.includes(refFieldOption.id)
                : false;
            if (!isValidOption) {
              error = true;
              errorMsg = `${field.label} value is not a valid option`;
            }
          } else if (
            field['options'].length > 0 &&
            !isEmpty(field['value']) &&
            isEmpty(_.find(field['options'], { label: field['value'] }))
          ) {
            error = true;
            errorMsg = `${field.label} is required`;
          }
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

      case 'user_directory':
      case 'select':
        if (isEmpty(field.value)) {
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
  return { error, errorMsg, success, successMsg, invalidRef };
}

export function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export function customValidateData(field, from = '') {
  let error = false;
  let errorMsg = '';
  let success = false;
  let successMsg = '';
  let invalidRef = false;
  switch (field.type) {
    case 'number':
      const additionalConfig = field['additional_config'];
      const numValue = field.value;
      if (isEmpty(numValue) && field.required) {
        error = true;
        errorMsg = `${field.label} is required`;
      } else if (
        !isEmpty(numValue) &&
        isNumeric(numValue) &&
        additionalConfig
      ) {
        const { min, max, allow_decimal, allow_negative } = additionalConfig;
        if (!isEmpty(max) && numValue > max) {
          error = true;
          errorMsg = `Max allowed value is ${max}`;
        } else if (!isEmpty(min) && numValue < min) {
          error = true;
          errorMsg = `Min allowed value is ${min}`;
        } else {
          const allowDecimal = allow_decimal ?? false;
          const allowNegative = allow_negative ?? false;

          const regex = allowDecimal
            ? allowNegative
              ? /^-?\d*\.?\d*$/
              : /^\d*\.?\d*$/
            : allowNegative
              ? /^-?\d*$/
              : /^\d*$/;

          if (!regex.test(numValue)) {
            error = true;
            errorMsg =
              allowDecimal && allowNegative
                ? 'Number is required'
                : allowDecimal
                  ? 'Negative value are not allowed'
                  : allowNegative
                    ? 'Decimal value are not allowed'
                    : 'Decimal and negative values are not allowed';
          }
        }
      }
      break;
    case 'otp':
      if (isEmpty(field.value) && field.required && from !== 'otp') {
        error = true;
        errorMsg = `${field.label} is required`;
      } else if (isEmpty(field['ref_value']) && from === 'otp') {
        error = true;
        errorMsg = `Reference data is required`;
        invalidRef = true;
      } else if (isEmpty(field['ref_value']) && field.required) {
        error = true;
        errorMsg = `Get OTP`;
        invalidRef = true;
      } else if (!isEmpty(field['ref_value'])) {
        const validateRefValue =
          field['ref_value_type'] === 'PHONE'
            ? !validateMobileNumber(field['ref_value'])
            : !isEmail(field['ref_value']);
        if (validateRefValue) {
          error = true;
          errorMsg =
            field['ref_value_type'] === 'PHONE'
              ? `${field['ref_value']} is not a valid mobile number`
              : `${field['ref_value']} is not a valid email`;
          invalidRef = true;
        } else if (!isEmpty(field.value) && field.value.length !== 4) {
          error = true;
          errorMsg = 'Incorrect OTP. Retry.';
        } else if (
          !isEmpty(field.value) &&
          field.value.length === 4 &&
          (isEmpty(field.res) ||
            (!isEmpty(field.res) && isEmpty(field.res.otp_code)))
        ) {
          error = true;
          errorMsg = 'Incorrect OTP. Retry.';
        } else if (
          !isEmpty(field.value) &&
          !isEmpty(field.res) &&
          !isEmpty(field.res.otp_code) &&
          field.value != field.res.otp_code
        ) {
          error = true;
          errorMsg = 'Incorrect OTP. Retry.';
        } else if (
          !isEmpty(field.value) &&
          !isEmpty(field.res) &&
          !isEmpty(field.res.otp_code) &&
          field.value == field.res.otp_code
        ) {
          success = true;
          successMsg = 'Correct OTP';
        }
      }
  }
  return { error, errorMsg, success, successMsg, invalidRef };
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        cb(position.coords);
      },
      (error) => {
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
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // location retrieved
        highAccuracySuccess = true;
        navigator.geolocation.clearWatch(watchId);
        cb(position.coords);
      },
      (error) => {
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

const sanitizeValues = (obj) => {
  const result = {};
  for (const key in obj) {
    const val = obj[key];

    if (
      (typeof val === 'string' || typeof val === 'number') &&
      !isNaN(val) &&
      val !== '' &&
      val !== null
    ) {
      result[key] = Number(val);
    } else {
      result[key] = val;
    }
  }
  return result;
};

/**
 * Compile the expression, if result is false then return the default value
 * else return the compiled expression value
 */
const calculateConditionalMatch = (expressions, values, defaultValue) => {
  const safeValues = sanitizeValues(values);
  for (const expr of expressions) {
    const fn = compileExpression(expr);
    const result = fn(safeValues);
    if (result !== 'false') {
      return result;
    }
  }
  if (defaultValue && !isEmpty(values)) {
    const fn = compileExpression(defaultValue);
    const result = fn(safeValues);
    return result !== 'false' ? result : null;
  }

  return null;
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
 * Expr field should have stmt, expr_type and dependant_fields, if any is not there then throw empty array
 * otherwise calculate expression
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

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getCalculatedFields(fields) {
  const calcFields = [];
  _.forEach(fields, (field) => {
    if (
      field.type &&
      field.type === 'number' &&
      field.additional_config &&
      field.additional_config.calc &&
      field.additional_config.calc.expr
    ) {
      calcFields.push(field);
    }
  });
  return calcFields;
}

export const isFieldCalculated = (field) => {
  return !isEmpty(field['additional_config']) &&
    !isEmpty(field['additional_config']['calc']) &&
    !isEmpty(field['additional_config']['calc']['expr'])
    ? true
    : false;
};

export const getDatePartValue = (type) => {
  const date = moment();
  switch (type) {
    case 'dayofweek':
      return date.format('dddd');
    case 'dayofthemonth':
      return date.format('DD');
    case 'weekno':
      return date.isoWeek().toString();
    case 'monthno':
      return date.format('MM');
    case 'monthname':
      return date.format('MMM-YY');
    case 'year':
      return date.format('YYYY');
    default:
      return null;
  }
};
