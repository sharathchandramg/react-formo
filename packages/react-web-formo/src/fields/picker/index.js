import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class PickerField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            value: null,
        };
    }

    handleChange = event => {
        let val = event.target.value;
        console.log(val);
        this.setState({ value: val });
        this.props.updateValue(this.props.attributes.name, val);
    };

    renderWebPicker = pickerValue => {
        const { theme, attributes } = this.props;
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'start',
                    fontSize: '20px',
                    margin: '10px',
                }}
            >
                <div style={{ flex: 3 }}>
                    <p
                        style={{
                            margin: 0,
                            justifySelf: 'flexStart',
                            marginRight: '20px',
                            marginLeft: '10px',
                        }}
                    >
                        {attributes.label}
                    </p>
                </div>
                <div style={{ flex: 7 }}>
                    <select
                        style={{
                            padding: 2,
                            width: '400px',
                            height: '25px',
                            backgroundColor: 'white',
                        }}
                        mode={attributes.mode}
                        value={pickerValue}
                        onChange={this.handleChange}
                    >
                        {attributes.options.map((item, index) => (
                            <option key={index} label={item} value={item} />
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        const pickerValue =
            this.state.value !== null
                ? this.state.value
                : typeof attributes.value !== 'undefined' &&
                  attributes.value !== null
                ? attributes.value
                : '';

        return (
            <div>
                {this.renderWebPicker(pickerValue)}
                <div style={{ padding: '0 15 15 0' }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </div>
            </div>
        );
    }
}
