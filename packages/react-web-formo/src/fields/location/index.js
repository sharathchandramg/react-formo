import React, { Component } from 'react';

export default class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationValue: 'Fetching ...',
    };
  }
  componentDidMount() {
    this.getLocation();
  }

  getLocation = () => {
    if (!(navigator.geolocation == 'undefined')) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.error,
        {
          timeout: 5000,
        }
      );
    } else {
      console.log(`Unable to fetch location`);
    }
  };

  getCoordinates = position => {
    var cords = position.coords;
    this.props.updateValue(this.props.attributes.name, {
      lat: cords.latitude,
      long: cords.longitude,
    });
    this.setState({
      locationValue: `http://maps.google.com/maps?q=${cords.latitude},${cords.longitude}`,
    });
  };

  error = err => {
    if (err.code == err.PERMISSION_DENIED) {
      console.log(`User permission denied`);
      this.setState({ locationValue: '' });
      this.props.goBack();
    }
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
        <div style={{ display: 'flex', height: 45 }}>
          <input
            type={attributes['type']}
            value={this.state.locationValue}
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
            onChange={() => console.log(this.state.locationValue)}
          />
        </div>
      </div>
    );
  }
}
