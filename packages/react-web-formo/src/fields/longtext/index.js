import React, { Component } from 'react';
import { isEmpty } from '../../utils/validators';
import './index.css';

export default class LongTextField extends Component {
  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  getMaxLength = attributes => {
    const additionalConfig = attributes['additional_config'];
    let maxLength = 300;

    if (
      !isEmpty(additionalConfig) &&
      !isEmpty(additionalConfig['max_length'])
    ) {
      maxLength = Number(additionalConfig['max_length']);
    }

    return maxLength;
  };

  render() {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
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
          <p style={{ fontSize: 16, margin: 0 }}>
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
        <div>
          <textarea
            type={'text'}
            value={attributes['value']}
            id={attributes['name']}
            disabled={disableCondition}
            style={{
              width: '100%',
              border: '1px solid #979797',
              borderRadius: 5,
              padding: 5,
              fontSize: 20,
              outline: 'none',
              opacity: disableCondition ? 0.5 : 1,
            }}
            onChange={this.handleChange}
            maxLength={this.getMaxLength(attributes)}
            rows={5}
          />
        </div>
      </div>
    );
  }
}
