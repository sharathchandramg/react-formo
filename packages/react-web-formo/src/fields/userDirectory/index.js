import React from 'react';
import { isEmpty } from './../../utils/validators';
import './style.css';

const UserDirectoryField = (props) => {
  const { attributes } = props;
  const showFirstOption = !!attributes?.config?.show_first_option;

  const handleOnclick = () => {
    if (typeof props.renderComponent === 'function') {
      props.renderComponent(props);
    }
  };

  const getLabel = () => {
    let label = 'None';
    const value = attributes['value'];
    if (!isEmpty(value)) {
      const lk = attributes['labelKey'];
      if (attributes.multiple) {
        label = value.length;
      } else {
        label =
          lk && value[lk] && value['user_alias']
            ? `${value[lk]}(${value['user_alias']})`
            : lk && value[lk]
              ? value[lk]
              : 'None';
      }
    }
    return label;
  };

  const renderLabel = () => {
    const disableCondition = !attributes.editable;
    return (
      <div
        className={`user-directory-data-wrapper ${disableCondition ? 'user-disabled' : ''}`}
        onClick={handleOnclick}
      >
        <h6 className={showFirstOption ? 'user-value-chip' : ''}>
          {getLabel()}
        </h6>
        <i className="fal fa-angle-right" aria-hidden="true"></i>
      </div>
    );
  };

  return (
    <div className="user-directory-field-wrapper">
      <div className="user-directory-label-wrapper">
        <div className="label-text">
          <p>
            {attributes['label']} {attributes['required'] ? `*` : ''} :
          </p>
        </div>
        <div className="error-text">
          {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
        </div>
      </div>
      <div className="user-directory-content-wrapper">{renderLabel()}</div>
    </div>
  );
};

export default UserDirectoryField;
