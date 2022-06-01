import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import TextInputField from './fields/textInput/index.js';
import PickerField from './fields/picker/index';
import StatusPicker from './fields/statusPicker/index';
import {
  autoValidate,
  getDefaultValue,
  getResetValue,
  customFieldCalculations,
} from './utils/helper';
import DateTimePicker from './fields/dateTimePicker/index.js';
import Lookup from './fields/lookup/index.js';
import CustomDataComponent from './fields/customDataView';
import Checklist from './fields/checklist';
import Location from './fields/location';
import SelectField from './fields/Select';
import UserDirectoryField from './fields/userDirectory';
import LongTextField from './fields/longtext';
import ImageField from './fields/image';
import DocumentField from './fields/document';
import { isEmpty } from './utils/validators';

import './styles.css';

const DefaultErrorComponent = props => {
  const attributes = props.attributes;
  if (attributes.error) {
    return <p>{attributes.errorMsg}</p>;
  }
  return null;
};

export default class FormO extends Component {
  constructor(props) {
    super(props);
    const initialState = this.getInitialState(props.fields);
    this.isFirstTime = false;
    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    this.isFirstTime = true;
    const { formData } = this.props;
    this.setValues(formData);
  }

  componentDidUpdate(prevProps) {
    const { formData } = this.props;
    if (!_.isEqual(prevProps, this.props) && this.isFirstTime) {
      this.setValues(formData);
      this.isFirstTime = false;
    }
  }

  getInitialState = fields => {
    const state = {};
    fields.forEach((field, index) => {
      const fieldObj = field;
      fieldObj.error = false;
      fieldObj.errorMsg = '';
      if (field && field.type) {
        fieldObj.value = getDefaultValue(field);
        state[field.name] = fieldObj;
      }
    });
    return state;
  };

  getLookupSubsciberFields = name => {
    const lookupSubscriberFields = _.filter(this.props.fields, field => {
      if (
        typeof field['data-pub'] !== 'undefined' &&
        field['data-pub'] === name
      ) {
        return field;
      }
    });
    return lookupSubscriberFields;
  };

  onValidateFields = () => {
    const newFields = {};
    Object.keys(this.state).forEach(fieldName => {
      const field = this.state[fieldName];
      if (field) {
        if (field.required !== undefined && field.required) {
          let validate = autoValidate(field);
          field.error = validate.error;
          field.errorMsg = validate.errorMsg;
        }

        newFields[field.name] = Object.assign({}, field);
      }
    });
    this.setState({ ...newFields });
  };

  onAddNewFields = (name, newObj) => {
    let fieldObj = this.state[name];
    if (fieldObj) {
      if (fieldObj.type === 'sub-form') {
        if (
          typeof fieldObj.value === 'undefined' ||
          fieldObj.value === null ||
          fieldObj.value.length === 0
        ) {
          fieldObj.value = [newObj];
        } else {
          let gIndex = _.indexOf(Object.keys(this.state), fieldObj.name);
          let newValue;
          if (gIndex !== -1) {
            let preValue = Object.values(this.state)[gIndex].value;
            let oIndex = _.findIndex(preValue, item => item._id === newObj._id);
            if (oIndex !== -1) {
              preValue[oIndex] = newObj;
              newValue = preValue;
            } else {
              newValue = _.concat(newObj, preValue);
            }
          } else {
            newValue = [newObj];
          }
          fieldObj.value = newValue;
        }
        const newField = {};
        newField[fieldObj.name] = fieldObj;
        this.setState({ ...newField });
      }
    }
  };

  resetForm = () => {
    const newFields = {};
    Object.keys(this.state).forEach(fieldName => {
      const field = this.state[fieldName];
      if (field) {
        field.value = '';
        field.editable !== undefined && !field.editable
          ? getDefaultValue(field)
          : getResetValue(field);
        field.error = false;
        field.errorMsg = '';
        if (field.type === 'group') {
          this[field.name].group.resetForm();
        }
        newFields[field.name] = field;
      }
    });
    this.setState({ ...newFields });
  };

  handleOnValueChange = (valueObj, value) => {
    valueObj.value = value;
    //autovalidate the fields
    if (this.props.autoValidation === undefined || this.props.autoValidation) {
      Object.assign(valueObj, autoValidate(valueObj));
    }
    // apply some custom logic for validation
    if (
      this.props.customValidation &&
      typeof this.props.customValidation === 'function'
    ) {
      Object.assign(valueObj, this.props.customValidation(valueObj));
    }
    const newField = {};
    newField[valueObj.name] = Object.assign({}, valueObj);

    if (
      valueObj &&
      valueObj['expr_field'] &&
      valueObj['expr_field'].length > 0
    ) {
      const res = customFieldCalculations(valueObj, value, this.state);
      if (res && res.length > 0) {
        res.forEach(item => {
          newField[item.name] = item;
        });
      }
    }

    if (
      this.props.onValueChange &&
      typeof this.props.onValueChange === 'function'
    ) {
      this.setState({ ...newField }, () => this.props.onValueChange());
    } else {
      this.setState({ ...newField });
    }
  };

  onValueChange = (name, value) => {
    const valueObj = this.state[name];
    if (valueObj) {
      const type = valueObj['type'];
      switch (type) {
        case 'sub-form':
          break;
        case 'lookup':
          const lookupSubscriberFields = this.getLookupSubsciberFields(name);
          const pk = valueObj['primaryKey'];
          const lk = valueObj['labelKey'];
          if (lookupSubscriberFields.length) {
            _.forEach(lookupSubscriberFields, field => {
              const key = field['name'];
              const val = value[key] || '';
              this.handleOnValueChange(field, val);
            });
          }
          const lookupValue = _.pick(value, [pk, lk, 'instance_id']);
          this.handleOnValueChange(valueObj, lookupValue);
          break;

        default:
          this.handleOnValueChange(valueObj, value);
      }
    }
  };

  getValues = () => {
    this.onValidateFields();
    const values = {};
    let isValidFields = true;
    Object.keys(this.state).forEach(fieldName => {
      const field = this.state[fieldName];
      if (field) {
        if (field.error !== undefined && field.error) {
          isValidFields = false;
        }
        if (
          field.type &&
          (field.type.match(/number/i) || field.type.match(/auto-incr-number/i))
        ) {
          values[field.name] = parseFloat(field.value);
        } else if (field.type && field.type.match(/date/i)) {
          values[field.name] = field.value
            ? moment(field.value)
                .utc()
                .valueOf()
            : '';
        } else if (field.type && field.type.match(/document/i)) {
          values[field.name] = !isEmpty(field.value)
            ? field.value.map(item => {
                return {
                  name: item['name'],
                  file_path: item['file_path'] ? item['file_path'] : '',
                  content_type: item['content_type']
                    ? item['content_type']
                    : '',
                };
              })
            : [];
        } else {
          values[field.name] = field.value;
        }
      }
    });
    if (isValidFields) {
      return values;
    } else {
      return null;
    }
  };

  getFieldValue = (fieldObj, value) => {
    const field = fieldObj;
    if (field.type === 'group') {
      const subFields = {};
      Object.keys(value).forEach(fieldName => {
        subFields[fieldName] = value[fieldName];
      });
      this[field.name].group.setValues(subFields);
      field.value = this[field.name].group.getValues();
    } else {
      field.value = value;
      if (
        this.props.autoValidation === undefined ||
        this.props.autoValidation
      ) {
        Object.assign(field, autoValidate(field));
      }
      if (
        this.props.customValidation &&
        typeof this.props.customValidation === 'function'
      ) {
        Object.assign(field, this.props.customValidation(field));
      }
    }
    return field;
  };

  setValues = (...args) => {
    if (args && args.length && args[0]) {
      const newFields = {};
      Object.keys(args[0]).forEach(fieldName => {
        const field = this.state[fieldName];
        if (field) {
          newFields[field.name] = this.getFieldValue(field, args[0][fieldName]);
        }
      });
      this.setState({ ...newFields });
    }
  };

  generateFields = () => {
    let formKeys = Object.keys(this.state);
    const { customComponents, errorComponent } = this.props;
    const renderFields = formKeys.map((fieldName, index) => {
      const field = this.state[fieldName];
      if (!field.hidden) {
        const commonProps = {
          key: index,
          attributes: this.state[field.name],
          updateValue: this.onValueChange,
          onAddNewFields: this.onAddNewFields,
          ErrorComponent: errorComponent || DefaultErrorComponent,
          formSubmissionType: this.props.formSubmissionType,
        };

        switch (field.type) {
          case 'text':
          case 'email':
          case 'number':
          case 'url':
          case 'mobNumber':
          case 'password':
          case 'phone':
          case 'calculated':
          case 'auto-incr-number':
            return (
              <TextInputField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
              />
            );

          case 'longtext':
            return (
              <LongTextField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
              />
            );

          case 'picker':
            return (
              <PickerField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
              />
            );

          case 'status_picker':
            return (
              <StatusPicker
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
              />
            );

          case 'date':
            return (
              <DateTimePicker
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
              />
            );

          case 'lookup':
            return (
              <Lookup
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'customDataView':
            return (
              <CustomDataComponent
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );
          case 'checklist':
            return (
              <Checklist
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'location':
            return (
              <Location
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'select':
            return (
              <SelectField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'user_directory':
            return (
              <UserDirectoryField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'image':
            return (
              <ImageField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          case 'document':
            return (
              <DocumentField
                ref={c => {
                  this[field.name] = c;
                }}
                {...commonProps}
                {...this.props}
              />
            );

          default:
            return null;
        }
      }
    });
    return renderFields;
  };

  render() {
    return <div className="mainForm">{this.generateFields()}</div>;
  }
}
