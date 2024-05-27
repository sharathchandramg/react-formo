import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';

class RatingField extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (value) => {
    this.props.updateValue(this.props.attributes.name, value);
  };

  getIcon = (attributes) => {
    const icon = attributes?.additional_config?.icon;
    switch (icon) {
      case "smile":
      case "face-smile":
        return "smile";
      default:
        return icon;
    }
  };


  renderLabel = () => {
    return (
      <label htmlFor="ratingField">
        {this.props.attributes.label}
        {this.props.attributes['required'] ? `*` : ''}
      </label>
    );
  };

  renderIcon = () => {
    const { attributes } = this.props;
    const value = attributes["value"] || 0;
    const noOfIcons = attributes?.additional_config?.no_of_icons;
    const icon = this.getIcon(attributes);

    return (
      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            ...(noOfIcons > 5 ? { justifyContent: "space-between" } : {})
          }}
        >
          {Array.from(Array(noOfIcons).keys()).map((item) => {
            return (
              <div key={item} style={{ paddingRight: noOfIcons <= 5 ? 10 : 0 }}>
                <i
                  className={`fa fa-${icon}`}
                  style={{
                    fontSize: 25,
                    color: value > 0 && item + 1 <= value ? "rgb(255, 212, 59)" : "#828282",
                    cursor: "pointer"
                  }}
                  onClick={() => this.handleChange(item + 1)}
                ></i>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  render() {
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
        }}
      >
        <p style={{ fontSize: 20, margin: 0 }}>{this.renderLabel()}</p>
      </div>
      <div style={{ fontSize: 20, margin: 0 }}>{this.renderIcon()}</div>
    </div>
    );
  }
}

export default RatingField;
