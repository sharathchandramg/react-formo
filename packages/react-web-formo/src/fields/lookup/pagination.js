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

  numberOfRecords = () => {
    return (
      <div className="padding-r20">{`1 - ${this.props.pageRecords} of ${this.props.totalRecords}`}</div>
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
            this.props.totalRecords === this.props.pageRecords ? 'disabled' : ''
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
