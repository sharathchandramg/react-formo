import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';
import TableModal from './tableModal';
import './style.css';

export default class SimpleGrid extends Component {
  wrapperRef;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedItm: {},
      data: {},
      rowData: null,
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
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleModal();
    }
  };

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

  handleOnDoneClick = () => {
    let summary = {
      label: this.getSummaryLabel(),
      data: this.state.data,
    };
    this.props.updateValue(this.props.attributes.name, summary);
    this.setState({ modalVisible: false });
  };

  onChangeText = (rk, ck, value) => {
    let data = this.state.data;
    const preColSum = data[`${String.fromCharCode(931)}`][ck];
    const header_type = data['type'];
    const ck_type = header_type[ck];
    if (ck_type.toLowerCase() === 'number') {
      const preColVal = data[rk][ck] || '0';
      data[rk][ck] = value;
      if (value && !isNaN(value)) {
        if (preColVal) {
          const diff =
            this.getFormattedNumber(value) - this.getFormattedNumber(preColVal);
          data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
            this.getFormattedNumber(preColSum) + diff
          );
        } else {
          data[`${String.fromCharCode(931)}`][ck] = this.getFormattedNumber(
            this.getFormattedNumber(preColSum) + this.getFormattedNumber(value)
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
    this.setState({ data: data });
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

  getLabel = (value) => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  renderSimpleGridUI = () => {
    const { attributes } = this.props;
    const disableCondition =
      this.props.formSubmissionType === 'update' && !attributes.editable;
    return (
      <div
        className={`simple-grid-data-wrapper ${
          disableCondition ? 'disabled' : ''
        }`}
        onClick={() => this.toggleModal()}
      >
        <p style={{ paddingStart: 5 }}>{attributes.label}</p>
        <div className="simple-grid-value-icon-wrapper">
          <h6>{this.getLabel(attributes.value)}</h6>
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    return (
      <>
        <div className="simple-grid-wrapper">
          <div className="simple-grid-label-wrapper">
            <div className="simple-grid-label-text">
              <p>
                {attributes['label']} {attributes['required'] ? `*` : ''} :
              </p>
            </div>
            <div className="simple-grid-error-text">
              {attributes['error'] && (
                <p id="error">{attributes['errorMsg']}</p>
              )}
            </div>
          </div>
          <div className="simple-grid-content-wrapper">
            {this.renderSimpleGridUI()}
          </div>
        </div>
        {this.state.modalVisible && (
          <TableModal
            modalVisible={this.state.modalVisible}
            toggleModal={this.toggleModal}
            data={this.state.data}
            label={attributes.label}
            summary={this.getSummaryLabel()}
            handleOnDoneClick={this.handleOnDoneClick}
            wrapperRef={this.wrapperRef}
            onChangeText={this.onChangeText}
            attributes={attributes}
          />
        )}
      </>
    );
  }
}
