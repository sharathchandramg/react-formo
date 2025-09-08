import React, { Component } from 'react';

export default class StatusPickerField extends Component {
  handleChange = (event) => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  renderWebPicker = () => {
    const { attributes } = this.props;
    const disableCondition = !attributes.editable;

    const wrapStyle = {
      position: 'relative',
      width: '100%',
    };
    const selectStyle = {
      width: '100%',
      height: 45,
      fontSize: 16,
      borderRadius: '5px',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      color: attributes.show_first_option ? 'transparent' : 'inherit',
      paddingRight: 36,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23222222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '12px',
    };

    const valueOverlayStyle = {
      position: 'absolute',
      left: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'yellow',
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 16,
      lineHeight: '20px',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 48px)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      pointerEvents: 'none',
    };

    return (
      <div style={wrapStyle}>
        <select
          style={selectStyle}
          value={attributes.value}
          onChange={this.handleChange}
          disabled={disableCondition}
        >
          {attributes.options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {attributes.show_first_option && attributes.value ? (
          <span style={valueOverlayStyle}>{attributes.value}</span>
        ) : null}
      </div>
    );
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
        <div>{this.renderWebPicker()}</div>
      </div>
    );
  }
}
