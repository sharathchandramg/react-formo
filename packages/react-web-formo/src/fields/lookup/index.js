import React, { Component } from 'react';
import Modal from 'react-modal';
import Pagination from './pagination';
import { isEmpty } from './../../utils/validators';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 50,
      page: 0,
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

  getSelectedValue = () => {
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

  renderLookupUI = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div
        className={`lookup-data-wrapper ${disableCondition ? 'disabled' : ''}`}
        onClick={this.openModal}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getSelectedValue()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  handleChangeRowsPerPage = data => {
    this.setState({ rowsPerPage: Number(data) });
  };

  paginationStartNumber = page => {
    const { attributes } = this.props;
    if (attributes.total_records == 0) {
      return 0;
    } else if (page === 0) {
      return 1;
    } else {
      return page * this.state.rowsPerPage + 1;
    }
  };

  endRecordNumber = page => {
    const { attributes } = this.props;
    const endNumber = page * this.state.rowsPerPage + this.state.rowsPerPage;
    if (attributes.total_records < endNumber) return attributes.total_records;
    else return endNumber;
  };

  paginationEndNumber = page => {
    const { attributes } = this.props;
    if (attributes.total_records === 0) {
      return 0;
    } else if (page === 0) {
      return attributes.options.length;
    } else {
      return this.endRecordNumber(page);
    }
  };

  handleChangePage = text => {
    const { attributes } = this.props;
    if (text === 'dec') {
      if (this.state.page !== 0) {
        if (
          attributes.data_source &&
          attributes.data_source.referenceId.trim() !== ''
        ) {
          this.props.getLookupData(
            attributes.data_source.referenceId,
            this.paginationStartNumber(this.state.page - 1) - 1,
            this.paginationEndNumber(this.state.page - 1)
          );
        }
        this.setState({ page: this.state.page - 1 });
      }
    } else if (text === 'inc') {
      if (attributes.total_records !== attributes.options.length) {
        if (
          attributes.data_source &&
          attributes.data_source.referenceId.trim() !== ''
        ) {
          this.props.getLookupData(
            attributes.data_source.referenceId,
            this.paginationStartNumber(this.state.page + 1) - 1,
            this.paginationEndNumber(this.state.page + 1)
          );
        }
        this.setState({ page: this.state.page + 1 });
      }
    }
    const element = document.getElementById('modal-title-wrapper');
    element.scrollIntoView(true);
  };

  renderOptionsModal = () => {
    const { attributes } = this.props;
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <div id="modal-title-wrapper" style={{ marginBottom: '20px' }}>
          <p>{`${attributes['label']} data`}</p>
        </div>
        <div className="modal-content-wrapper ">
          {/* <div className="search-box-wrapper">
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
          </div> */}
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
            rowsPerPage={this.state.rowsPerPage}
            totalRecords={attributes.total_records}
            page={this.state.page}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            paginationStartNumber={this.paginationStartNumber}
            endRecordNumber={this.endRecordNumber}
            paginationEndNumber={this.paginationEndNumber}
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
            <p>
              {attributes['label']} {attributes['required'] ? `*` : ''} :
            </p>
          </div>
          <div className="error-text">
            {attributes['error'] && <p id="error">{attributes['errorMsg']}</p>}
          </div>
        </div>
        <div className="lookup-content-wrapper">
          {this.renderLookupUI()}
          {this.state.modalIsOpen ? this.renderOptionsModal() : ''}
        </div>
      </div>
    );
  }
}
