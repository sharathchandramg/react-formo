import React, { Component } from 'react';
import Modal from 'react-modal';
import Pagination from './pagination';
import { isEmpty } from './../../utils/validators';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 25,
      page: 0,
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

  getValue = () => {
    const { attributes } = this.props;
    let value = 'None';
    if (!isEmpty(attributes['value'])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes['value'].map(obj => {
          const labelKey = attributes.objectType
            ? obj[attributes.labelKey]
            : obj;
          return labelKey;
        });
        if (labelKeyArr.length) {
          value = ` ${labelKeyArr.length} | ${labelKeyArr.toString()}`;
        }
      } else {
        value = attributes.objectType
          ? attributes['value'][attributes.labelKey]
          : attributes['value'];
      }
    }
    return value;
  };

  renderLookupData = () => {
    const { attributes } = this.props;
    return (
      <div className="lookup-data-wrapper" onClick={this.openModal}>
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getValue()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  handleChangeRowsPerPage = data => {
    this.setState({ rowsPerPage: data });
  };

  handleChangePage = text => {
    if (text === 'dec') {
      if (this.state.page !== 0) this.setState({ page: this.state.page - 1 });
    } else if (text === 'inc') {
      if (this.state.totalRecords !== this.state.pageRecords)
        this.setState({ page: this.state.page + 1 });
    }
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
        <div className="modal-title-wrapper">
          <p>{`${attributes['label']} data`}</p>
        </div>
        <div className="modal-content">
          <div className="search-box-wrapper">
            <div className="search-box">
              <input
                className="search-text"
                type="text"
                placeholder="Search..."
                onChange={this.filterTeams}
              />
              <div className="search-btn">
                <i className="fas fa-search" />
              </div>
            </div>
          </div>
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
          <Pagination
            totalRecords={attributes.options.length}
            page={this.state.page}
            pageRecords={attributes.options.length}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
      </Modal>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <div className="lookup-wrapper">
        <div className="label-wrapper">
          <div className="label-text">
            {attributes['required'] && (
              <p>
                {attributes['label']} {attributes['required'] ? `*` : ''} :
              </p>
            )}
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="lookup-content-wrapper">
          {this.renderLookupData()}
          {this.state.modalIsOpen ? this.renderOptions() : ''}
        </div>
      </div>
    );
  }
}
