import React, { Component } from 'react';
import Modal from 'react-modal';
import { isEmpty } from './../../utils/validators';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openLookupOptions: false,
      attributes: this.props.attributes,
      modalIsOpen: false,
    };
  }

  handleChange = data => {
    this.props.updateValue(this.props.attributes.name, data);
    this.closeModal();
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  getLabel = () => {
    const { attributes } = this.props;
    let label = 'None';
    if (!isEmpty(attributes['value'])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes['value'].map(obj => {
          const labelKey = attributes.objectType
            ? obj[attributes.labelKey]
            : obj;
          return labelKey;
        });
        if (labelKeyArr.length) {
          label = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        label = attributes.objectType
          ? attributes['value'][attributes.labelKey]
          : attributes['value'];
      }
    }
    return label;
  };

  renderLookupData = () => {
    const { attributes } = this.props;
    return (
      <div className="lookup-data-wrapper" onClick={this.openModal}>
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getLabel()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  renderOptions = () => {
    const { attributes } = this.props;
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        {attributes.options.length > 0 &&
          attributes.options.map((item, index) => {
            return (
              <div
                key={index}
                className="lookup-options-value"
                onClick={() => this.handleChange(item)}
              >
                {item[attributes.labelKey]}
              </div>
            );
          })}
      </Modal>
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
          <div
            style={{
              width: '30%',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            {attributes['required'] && (
              <p style={{ fontSize: 16, margin: 0 }}>
                {attributes['label']} * :
              </p>
            )}
            {!attributes['required'] && (
              <p style={{ fontSize: 16, margin: 0 }}>{attributes['label']}:</p>
            )}
          </div>
          <div
            style={{
              width: '70%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
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
        </div>
        <div className="lookup-wrapper">
          {this.renderLookupData()}
          {this.state.modalIsOpen ? this.renderOptions() : ''}
        </div>
      </div>
    );
  }
}
