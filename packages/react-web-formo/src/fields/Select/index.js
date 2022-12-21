import React from 'react';
import { isEmpty } from './../../utils/validators';
import './style.css';
import './../picker/style.css';

const SelectField = props => {
  const { attributes, updateValue } = props;

  const handleOnclick = () => {
    if (typeof props.renderComponent === 'function') {
      props.renderComponent(props);
    }
    return;
  };

  const getLabel = () => {
    let label = 'None';
    if (!isEmpty(attributes['value'])) {
      label = attributes['multiple']
        ? attributes['value'].length
        : attributes['value'];
    }
    return label;
  };

  const renderLabel = () => {
    const disableCondition =
      props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div
        className={`select-data-wrapper ${disableCondition ? 'disabled' : ''}`}
        onClick={() => handleOnclick()}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{getLabel()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  const handleChange = value => {
    let newSelected =
      attributes && attributes.multiple ? attributes['value'] || [] : value;
    if (attributes && attributes.multiple) {
      newSelected = Array.isArray(newSelected) ? newSelected : [];
      const index = attributes.objectType
        ? newSelected.findIndex(
            option =>
              option[attributes.primaryKey] === value[attributes.primaryKey]
          )
        : newSelected.indexOf(value);
      if (index === -1) {
        newSelected.push(value);
      } else {
        newSelected.splice(index, 1);
      }
      updateValue(attributes.name, newSelected);
    } else {
      updateValue(attributes.name, value);
    }
  };

  const renderOptionsAsList = () => {
    const value = attributes['value'] || [];
    return (
      <div className="options-wrapper">
        {attributes.options.length > 0 &&
          attributes.options
            .slice(1, attributes.options.length)
            .map((item, index) => {
              let isSelected = false;
              if (attributes && attributes.multiple) {
                isSelected = attributes.objectType
                  ? value &&
                    value.findIndex(
                      option =>
                        option[attributes.primaryKey] ===
                        item[attributes.primaryKey]
                    ) !== -1
                  : value && value.indexOf(item) !== -1;
              } else {
                isSelected = value.indexOf(item) !== -1;
              }
              return (
                <div className="value-wrapper" key={`select-${index}`}>
                  <input
                    type={
                      attributes && attributes.multiple ? 'checkbox' : 'radio'
                    }
                    id={`${attributes.name}-${item}`}
                    name={attributes.name}
                    value={item}
                    onChange={() => handleChange(item)}
                    checked={isSelected}
                  />
                  <label
                    htmlFor={`${attributes.name}-${item}`}
                    className="option-label"
                  >
                    {item}
                  </label>
                </div>
              );
            })}
      </div>
    );
  };

  return (
    <div className="select-field-wrapper">
      <div className="select-label-wrapper">
        <div className="label-text">
          <p>
            {attributes['label']} {attributes['required'] ? `*` : ''} :
          </p>
        </div>
        <div className="error-text">
          {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
        </div>
      </div>
      {attributes &&
      attributes['additional_config'] &&
      attributes['additional_config']['show_inline'] ? (
        <div className="select-content-wrapper" style={{ height: 'unset' }}>
          {renderOptionsAsList()}
        </div>
      ) : (
        <div className="select-content-wrapper">{renderLabel()}</div>
      )}
    </div>
  );
};

export default SelectField;
