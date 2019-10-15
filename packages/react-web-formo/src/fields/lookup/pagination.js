import React, { Component } from 'react';
import './pagination.css';

export default class Pagination extends Component {
  selectPageOptions = () => {
    return (
      <select
        value={this.props.rowsPerPage}
        onChange={event =>
          this.props.handleChangeRowsPerPage(event.target.value)
        }
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    );
  };

  paginationStartNumber = () => {
    if (this.props.totalRecords == 0) {
      return 0;
    } else if (this.props.page === 0) {
      return 1;
    } else {
      return this.props.page * this.props.rowsPerPage + 1;
    }
  };

  paginationEndNumber = () => {
    if (this.props.totalRecords == 0) {
      return 0;
    } else if (this.props.page === 0) {
      return this.props.pageRecords;
    } else {
      return (
        this.props.totalRecords -
        this.props.page * this.props.rowsPerPage +
        this.props.rowsPerPage
      );
    }
  };

  numberOfRecords = () => {
    return (
      <div className="padding-r20">{`${this.paginationStartNumber()} - ${this.paginationEndNumber()} of ${
        this.props.totalRecords
      }`}</div>
    );
  };

  pageIcons = () => {
    return (
      <div className="page-icons-wrapper">
        <i
          className={`far fa-angle-left padding-r20 ${
            this.props.page === 0 ? 'disabled' : ''
          }`}
          onClick={() => this.props.handleChangePage('dec')}
        ></i>
        <i
          className={`far fa-angle-right ${
            this.props.totalRecords -
              this.props.page * this.props.rowsPerPage +
              this.props.rowsPerPage ===
              this.props.totalRecords ||
            this.props.rowsPerPage > this.props.totalRecords
              ? 'disabled'
              : ''
          }`}
          onClick={() => this.props.handleChangePage('inc')}
        ></i>
      </div>
    );
  };

  render() {
    return (
      <div className="pagination-root">
        <div className="padding-r20">
          Rows per page : {this.selectPageOptions()}
        </div>
        {this.numberOfRecords()}
        {this.pageIcons()}
      </div>
    );
  }
}
