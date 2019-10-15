import React from 'react';
import './pagination.css';

const Pagination = props => {
  const selectRowsPerPageOptions = () => {
    return (
      <select
        value={props.rowsPerPage}
        onChange={event => props.handleChangeRowsPerPage(event.target.value)}
        disabled={true}
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    );
  };

  const numberOfRecordsSelected = () => {
    return (
      <div className="padding-r20">{`${props.paginationStartNumber(
        props.page
      )} - ${props.paginationEndNumber(props.page)} of ${
        props.totalRecords
      }`}</div>
    );
  };

  const pageIcons = () => {
    return (
      <div className="page-icons-wrapper">
        <i
          className={`far fa-angle-left padding-r20 ${
            props.page === 0 ? 'disabled' : ''
          }`}
          onClick={() => props.handleChangePage('dec')}
        ></i>
        <i
          className={`far fa-angle-right ${
            props.totalRecords === props.endRecordNumber(props.page)
              ? 'disabled'
              : ''
          }`}
          onClick={() => props.handleChangePage('inc')}
        ></i>
      </div>
    );
  };

  return (
    <div className="pagination-root">
      <div className="padding-r20">
        Rows per page : {selectRowsPerPageOptions()}
      </div>
      {numberOfRecordsSelected()}
      {pageIcons()}
    </div>
  );
};

export default Pagination;
