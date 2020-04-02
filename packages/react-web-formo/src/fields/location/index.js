import React, { Component } from 'react';

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationValue: '',
    };
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.props.updateValue(this.props.attributes.name, {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          this.setState({
            locationValue: `http://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
          });
        },
        error => {
          this.props.updateValue(
            this.props.attributes.name,
            `Unable to fetch location`
          );
        }
      );
    }
  }

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
        <div style={{ display: 'flex', height: 45 }}>
          <input
            type={attributes['type']}
            value={locationValue}
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
            onChange={() => console.log(locationValue)}
          />
        </div>
      </div>
    );
  }
}
