import React, { Component } from 'react';

import SearchableDropdown from './searchableDropDown';
import { isEmpty } from './../../utils/validators';

export default class CascadingDropdownField extends Component {
  handleChange = value => {
    const { attributes, state } = this.props;
    this.props.updateValue(attributes.name, value);
    Object.keys(state).forEach(ele => {
      if (
        state[ele] &&
        state[ele]['type'] === 'cascading-dropdown' &&
        state[ele]['ref_field_name'] === attributes.name
      ) {
        this.props.updateValue(ele, null);
      }
    });
  };

  getOptions = () => {
    const { attributes, state } = this.props;
    const options =
      !isEmpty(attributes) && !isEmpty(attributes.options)
        ? attributes.options
        : [];
    if (
      !isEmpty(attributes) &&
      !isEmpty(attributes.ref_field_name) &&
      !isEmpty(options)
    ) {
      const refField = state[attributes.ref_field_name];
      const refSelectedOption =
        !isEmpty(refField) && !isEmpty(refField.value)
          ? _.find(refField.options, { label: refField.value })
          : null;
      return !isEmpty(refField) &&
        !isEmpty(refField.value) &&
        !isEmpty(refSelectedOption) &&
        !isEmpty(refSelectedOption.id)
        ? options.filter(item => item.ref_id.includes(refSelectedOption.id))
        : [];
    }
    return options;
  };

  getSelectedValue = attributes => {
    const options = !isEmpty(this.getOptions()) ? this.getOptions() : [];
    const value =
      !isEmpty(attributes) && !isEmpty(attributes.value)
        ? attributes.value
        : null;
    const option = !isEmpty(value) ? _.find(options, { label: value }) : null;
    return !isEmpty(option) && !isEmpty(option.label) ? option.label : '';
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="cascading-root">
        <div className="cascading-label-wrapper">
          <p>
            {attributes['label']} {attributes['required'] ? `*` : ''} :
          </p>
          {attributes['error'] && (
            <p
              id="error"
              style={{
                color: 'purple',
                fontSize: 12,
                margin: 0,
              }}
            >
              {attributes['errorMsg']}
            </p>
          )}
        </div>
        <div>
          <SearchableDropdown
            onItemSelect={item => this.handleChange(item)}
            items={this.getOptions()}
            selectedValue={this.getSelectedValue(attributes)}
            attributes={attributes}
          />
        </div>
      </div>
    );
  }
}
