import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './style.css';

export default class ImageField extends Component {
    static propTypes = {
        attributes: PropTypes.object,
        theme: PropTypes.object,
        updateValue: PropTypes.func,
        ErrorComponent: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            tilte: null,
            url: null,
            display: false,
        };
    }

    handleChange = event => {
        console.log(event.target.files[0]);
        let images = event.target.files[0];
        if (images != null) {
            console.log(images.name);
            this.setState({
                title: images.name,
                url: URL.createObjectURL(images),
                display: true,
            });
        }
    };

    render() {
        const { theme, attributes, ErrorComponent } = this.props;
        return (
            <div className="container">
                <p>{attributes.label}</p>
                <div>
                    {this.state.display && (
                        <img
                            src={this.state.url}
                            style={{ width: '200px', height: '200px' }}
                            alt={this.state.title}
                        />
                    )}
                </div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={event => this.handleChange(event)}
                    />
                    <input type="submit" />
                </div>
                <div style={{ paddingHorizontal: 15 }}>
                    <ErrorComponent {...{ attributes, theme }} />
                </div>
            </div>
        );
    }
}
