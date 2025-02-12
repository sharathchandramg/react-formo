import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';
import { Modal } from '@material-ui/core';
import './style.css';

export default class Lookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      editModal: false,
      selectedItm: {},
      data: {},
      rowData: null,
      rowIndex: 0,
    };
  }

  componentDidMount() {
    const { attributes } = this.props;
    if (attributes) {
      const data = this.getGridData();
      if (Object.keys(data).length) {
        this.setGridData(data);
      }
    }
  }

  getGridData = () => {
    const { attributes } = this.props;
    let mData = null;
    if (attributes) {
      if (
        !isEmpty(attributes['value']) &&
        !isEmpty(attributes['value']['data'])
      ) {
        const summary = attributes['value'];
        const selectedItm = summary['data'];
        mData = attributes['data'];
        if (!isEmpty(selectedItm)) {
          _.forEach(Object.keys(selectedItm), (rowKey) => {
            if (mData.hasOwnProperty(rowKey)) {
              mData[rowKey] = selectedItm[rowKey];
            }
          });
        }
      } else {
        mData = attributes['data'];
      }
    }
    return mData;
  };

  setGridData = (data) => {
    const header = data['header'];
    const header_type = data['type'];
    let summary = {};
    Object.keys(header).map((ck) => {
      let ckTotal = 0;
      let count = 0;
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          if (header_type && header_type[ck].toLowerCase() === 'number') {
            const ckValue = data[rk][ck] || '0';
            if (ckValue) {
              ckTotal = parseInt(ckTotal) + parseInt(ckValue);
            }
          } else if (
            header_type &&
            (header_type[ck].toLowerCase() === 'string' ||
              header_type[ck].toLowerCase() === 'text')
          ) {
            const ckValue = data[rk][ck];
            if (ckValue) {
              count += 1;
              ckTotal = count;
            }
          }
        }
      });
      summary[`${ck}`] = ckTotal;
    });
    data[`${String.fromCharCode(931)}`] = summary;
    this.setState({ data: data });
  };

  getFormattedNumber = (value) => {
    return Number(parseFloat(value).toFixed(2));
  };

  handleOnSaveClick = () => {
    let data = this.state.data;
    let rowData = this.state.rowData;
    let selectedItm = this.state.selectedItm;
    if (!isEmpty(rowData) && Array.isArray(rowData)) {
      _.forEach(rowData, (item) => {
        const rk = item['rowKey'];
        const ck = item['colKey'];
        const value = item['value'];
        const preColSum = data[`${String.fromCharCode(931)}`][ck];
        const header_type = data['type'];
        const ck_type = header_type[ck];
        if (ck_type.toLowerCase() === 'number') {
          const preColVal = data[rk][ck] || '0';
          data[rk][ck] = value;
          if (value && !isNaN(value)) {
            if (preColVal) {
              const diff =
                this.getFormattedNumber(value) -
                this.getFormattedNumber(preColVal);
              data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
                this.getFormattedNumber(preColSum) + diff
              );
            } else {
              data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
                this.getFormattedNumber(preColSum) +
                  this.getFormattedNumber(value)
              );
            }
          } else {
            data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
              this.getFormattedNumber(preColSum) -
                this.getFormattedNumber(preColVal)
            );
          }
        } else if (
          ck_type.toLowerCase() === 'string' ||
          ck_type.toLowerCase() === 'text'
        ) {
          const preColVal = data[rk][ck] || '';
          data[rk][ck] = value;
          if (value) {
            if (preColVal) {
              data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum);
            } else {
              data[`${String.fromCharCode(931)}`][ck] = parseInt(preColSum) + 1;
            }
          } else {
            data[`${String.fromCharCode(931)}`][ck] = preColSum
              ? parseInt(preColSum) - 1
              : parseInt(preColSum);
          }
        }
        selectedItm[rk] = data[rk];
      });
      this.setState({ data: data, selectedItm: selectedItm, editModal: false });
    } else {
      this.setState({ editModal: false });
    }
  };

  handleOnDoneClick = () => {
    let summary = {
      label: this.getSummaryLabel(),
      data: this.state.data,
    };
    this.props.updateValue(this.props.attributes.name, summary);
    this.setState({ modalVisible: false });
  };

  onChangeText = (rk, ck, text) => {
    let rowData = this.state.rowData;
    rowData = _.map(rowData, (item) => {
      if (item['rowKey'] === rk && item['colKey'] === ck) {
        item['value'] = text;
      }
      return item;
    });
    this.setState({ rowData: rowData });
  };

  toggleModal = () => {
    if (this.state.modalVisible) {
      this.setState({
        modalVisible: false,
      });
    } else {
      const { attributes } = this.props;
      if (attributes) {
        const data = this.getGridData();
        if (Object.keys(data).length) {
          this.setGridData(data);
        }
      }
      this.setState({ modalVisible: true });
    }
  };

  toggleEditModal = (rowData, rowIndex) => {
    const editModal = this.state.editModal;
    if (editModal) {
      this.setState({ editModal: false, rowData: null, rowIndex: 0 });
    } else {
      this.setState({ editModal: true, rowData: rowData, rowIndex: rowIndex });
    }
  };

  getLabel = (value) => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  getSummaryLabel = () => {
    const data = this.state.data;
    let rowLabel = '';
    if (!isEmpty(data) && Object.keys(data).length) {
      const summaryRow = data[`${String.fromCharCode(931)}`];
      const header_type = data['type'];
      Object.keys(summaryRow).map((key) => {
        const type = header_type[key];
        let colLabel = '';
        if (type.toLowerCase() === 'number') {
          colLabel = `${key} : ${summaryRow[key]}`;
          if (rowLabel && rowLabel.length) {
            rowLabel = `${rowLabel}, ${colLabel}`;
          } else {
            rowLabel = `${colLabel}`;
          }
        } else if (
          type.toLowerCase() === 'string' ||
          type.toLowerCase() === 'text'
        ) {
          colLabel = `${key} :${summaryRow[key]}`;
          if (rowLabel && rowLabel.length) {
            rowLabel = `${rowLabel}, ${colLabel}`;
          } else {
            rowLabel = `${colLabel}`;
          }
        }
      });
    }
    return rowLabel;
  };

  getTableHeader = (data) => {
    let tableHeader = [];
    if (data && Object.keys(data).length && !isEmpty(data['header'])) {
      const header = data['header'];
      Object.keys(header).map((hk) => {
        let headerCell = {
          rowKey: '#',
          colKey: hk,
          type: 'string',
          value: header[hk],
          editable: false,
        };
        tableHeader.push(headerCell);
      });
    }
    if (tableHeader.length) {
      tableHeader.unshift({
        rowKey: '#',
        colKey: '#',
        type: 'string',
        value: '#',
        editable: false,
      });
    }
    return tableHeader;
  };

  getRowTitle = (data) => {
    let tableTitle = [];
    if (data && Object.keys(data).length) {
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          let titleCell = {
            rowKey: rk,
            colKey: '',
            type: 'string',
            value: rk,
            editable: false,
          };
          tableTitle.push(titleCell);
        }
      });
    }
    return tableTitle;
  };

  getTableData = (data) => {
    let tableData = [];
    if (data && Object.keys(data).length && !isEmpty(data['type'])) {
      Object.keys(data).map((rk) => {
        if (
          !rk.match(/header/) &&
          !rk.match(/style/) &&
          !rk.match(/type/) &&
          rk !== `${String.fromCharCode(931)}`
        ) {
          let dataItem = {};
          dataItem['name'] = rk;
          let value = [];
          Object.keys(data[rk]).map((ck) => {
            let dataCell = {
              rowKey: rk,
              colKey: ck,
              type: data.type[ck],
              value: data[rk][ck],
              editable: rk == `${String.fromCharCode(931)}` ? false : true,
            };
            value.push(dataCell);
          });
          dataItem['data'] = value;
          tableData.push(dataItem);
        }
      });
    }
    return tableData;
  };

  getHeaderWidth = (data) => {
    let widthArr = [];
    if (data && Object.keys(data).length && !isEmpty(data['style'])) {
      const column_width = data['style']['column_width'];
      widthArr = Object.keys(column_width).map((key) => {
        return parseInt(column_width[key]);
      });
    } else {
      if (!isEmpty(data['header'])) {
        const len = Object.keys(data['header']).length;
        for (let i = 0; i < len; i++) {
          widthArr.push(100);
        }
      }
    }

    return widthArr;
  };

  getRowHeight = (data) => {
    let height = 40;
    if (data && Object.keys(data).length && !isEmpty(data['style'])) {
      if (!isEmpty(data['style']['row_height'])) {
        height = parseInt(data['style']['row_height']);
      }
    }
    return height;
  };

  handleOnclick = () => {
    if (typeof this.props.renderComponent === 'function') {
      this.props.renderComponent(this.props);
    }
    return;
  };

  getSelectedValue = () => {
    const { attributes } = this.props;
    let value = 'None';
    if (!isEmpty(attributes['value'])) {
      if (attributes.multiple) {
        const labelKeyArr = attributes['value'].map((obj) => {
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
        onClick={() => this.handleOnclick()}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="value-icon-wrapper">
          <h6>{this.getSelectedValue()}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <>
        <div className="lookup-wrapper">
          <div className="label-wrapper">
            <div className="label-text">
              <p>
                {attributes['label']} {attributes['required'] ? `*` : ''} :
              </p>
            </div>
            <div className="error-text">
              {attributes['error'] && (
                <p id="error">{attributes['errorMsg']}</p>
              )}
            </div>
          </div>
          <div className="lookup-content-wrapper">{this.renderLookupUI()}</div>
        </div>
        <Modal open={this.state.modalVisible} onClose={this.toggleModal}>
          <div id="doc-preview-modal-wrapper">
            <div
              className="doc-preview-modal-container"
              ref={(node) => (this.wrapperRef = node)}
            >
              <div className="doc-preview-modal-header">
                <p>Document(s)</p>
                <i
                  className="far fa-times-circle close-button"
                  onClick={() => this.toggleModal()}
                />
              </div>
              <div className="doc-preview-modal-body">
                <GridComponent
                  modalVisible={this.state.modalVisible}
                  theme={theme}
                  attributes={attributes}
                  toggleModalVisible={this.toggleModal}
                  toggleEditModal={this.toggleEditModal}
                  data={this.state.data}
                  handleOnDoneClick={this.handleOnDoneClick}
                  summary={this.getSummaryLabel()}
                  rowHeight={this.getRowHeight(this.state.data)}
                  widthArr={this.getHeaderWidth(this.state.data)}
                  tableHeader={this.getTableHeader(this.state.data)}
                  rowTitle={this.getRowTitle(this.state.data)}
                  tableData={this.getTableData(this.state.data)}
                />
              </div>
            </div>
            <SnackbarMessage
              handleClose={this.handleCloseSnackbar}
              message={this.state.errMessage}
              open={this.state.open}
            />
          </div>
        </Modal>
      </>
    );
  }
}
