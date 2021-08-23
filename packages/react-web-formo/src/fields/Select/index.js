import React from 'react';
import { isEmpty } from './../../utils/validators';
import './style.css';

const SelectField = props => {
  const { attributes } = props;

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
      <div className="select-content-wrapper">{renderLabel()}</div>
    </div>
  );
};

export default SelectField;
