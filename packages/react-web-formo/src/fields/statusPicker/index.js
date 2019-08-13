import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class StatusPickerField extends Component {
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
        const { attributes } = this.props;
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'start',
                    fontSize: '20px',
                }}
            >
                <p
                    style={{
                        margin: 0,
                        justifySelf: 'flexStart',
                        marginRight: '20px',
                    }}
                >
                    {attributes.label}
                    {attributes.required && '*'}
                </p>
                <div style={{ flex: 5 }}>
                    <select
                        style={{
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
                <div style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </div>
            </div>
        );
    }
}
