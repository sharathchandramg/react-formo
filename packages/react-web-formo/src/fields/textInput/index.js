import React, { Component } from 'react';

export default class TextInputField extends Component {
    handleChange = event => {
        this.props.updateValue(this.props.attributes.name, event.target.value);
    };

    render() {
        const { attributes } = this.props;
        return (
            <div
                style={{
                    width: '75%',
                    margin: 10,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <label>
                    <div>
                        {attributes['required'] && (
                            <p style={{ width: '1000px', margin: 0 }}>
                                {attributes['label']} * :
                            </p>
                        )}
                        {!attributes['required'] && (
                            <p style={{ width: '1000px', margin: 0 }}>
                                {attributes['label']}:
                            </p>
                        )}
                    </div>
                    {attributes['error'] && (
                        <p
                            id="error"
                            style={{
                                color: 'red',
                                fontSize: '10px',
                                margin: 0,
                            }}
                        >
                            {attributes['errorMsg']}
                        </p>
                    )}
                    <input
                        type={attributes['type']}
                        value={attributes['value']}
                        id={attributes['name']}
                        style={{
                            width: '80%',
                            height: 25,
                            margin: 5,
                            borderRadius: 5,
                        }}
                        onChange={this.handleChange}
                    />
                </label>
            </div>
        );
    }
}
