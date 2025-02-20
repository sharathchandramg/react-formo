import React, { Component } from 'react';
import { isEmpty } from './../../utils/validators';
import TableModal from './tableModal';
import './style.css';

/**
 * SimpleGrid component for rendering a grid with editable cells and a summary row.
 *
 * @extends Component
 */
export default class SimpleGrid extends Component {
  /**
   * Creates an instance of SimpleGrid.
   *
   * @param {Object} props - The properties passed to the component.
   */
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      data: {},
    };
  }

  /**
   * Lifecycle method called after the component is mounted.
   * Initializes the grid data if attributes are provided.
   */
  componentDidMount() {
    const { attributes } = this.props;
    if (attributes) {
      const data = this.getGridData();
      if (data && Object.keys(data).length) {
        this.setGridData(data);
      }
    }
  }

  /**
   * Retrieves the grid data from the component's attributes.
   *
   * @returns {Object} The grid data.
   */
  getGridData = () => {
    const { attributes } = this.props;
    if (!attributes) return {};
    const { value, data: gridData } = attributes;
    if (!isEmpty(value) && !isEmpty(value['data'])) {
      Object.keys(value.data).forEach((key) => {
        if (gridData?.hasOwnProperty(key)) {
          gridData[key] = value.data[key];
        }
      });
    }
    return gridData || {};
  };

  /**
   * Sets the grid data and calculates the summary row.
   *
   * @param {Object} gridData - The grid data to set.
   */
  setGridData = (gridData) => {
    const summary = {};
    const { header, type: headerType } = gridData;

    Object.keys(header).forEach((key) => {
      let total = 0,
        count = 0;
      Object.entries(gridData).forEach(([rowKey, rowData]) => {
        if (
          !['header', 'style', 'type'].includes(rowKey) &&
          rowKey !== `${String.fromCharCode(931)}`
        ) {
          const value = rowData[key] || 0;
          if (headerType[key].toLowerCase() === 'number') {
            total += parseInt(value, 10);
          } else if (
            ['string', 'text'].includes(headerType[key].toLowerCase())
          ) {
            count += value ? 1 : 0;
            total = count;
          }
        }
      });
      summary[key] = total;
    });
    gridData[`${String.fromCharCode(931)}`] = summary;
    this.setState({ data: gridData });
  };

  /**
   * Formats a number to two decimal places.
   *
   * @param {number} value - The number to format.
   * @returns {number} The formatted number.
   */
  getFormattedNumber = (value) => {
    return Number(parseFloat(value).toFixed(2));
  };

  /**
   * Handles the click event for the "Done" button.
   * Updates the value and hides the modal.
   */
  handleOnDoneClick = () => {
    this.props.updateValue(this.props.attributes.name, {
      label: this.getSummaryLabel(),
      data: this.state.data,
    });
    this.setState({ modalVisible: false });
  };

  /**
   * Handles the change event for text input in the grid.
   *
   * @param {string} rk - The row key.
   * @param {string} ck - The column key.
   * @param {string} value - The new value.
   */
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

  /**
   * Toggles the visibility of the modal.
   * If the modal is being shown, initializes the grid data.
   */
  toggleModal = () => {
    if (this.state.modalVisible) {
      this.setState({
        modalVisible: false,
      });
    } else {
      const { attributes } = this.props;
      if (attributes) {
        const data = this.getGridData();
        if (data && Object.keys(data).length) {
          this.setGridData(data);
        }
      }
      this.setState({ modalVisible: true });
    }
  };

  /**
   * Generates a summary label for the grid data.
   *
   * @returns {string} The summary label.
   */
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

  /**
   * Retrieves the label from the value object.
   *
   * @param {Object} value - The value object.
   * @returns {string} The label.
   */
  getLabel = (value) => {
    let label = 'None';
    if (typeof value !== 'undefined' && value && Object.keys(value).length) {
      return value.label ? value.label : 'None';
    }
    return label;
  };

  /**
   * Renders the UI for the simple grid.
   *
   * @returns {JSX.Element} The rendered UI.
   */
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

  /**
   * Renders the SimpleGrid component.
   *
   * @returns {JSX.Element} The rendered component.
   */
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
            onChangeText={this.onChangeText}
            attributes={attributes}
          />
        )}
      </>
    );
  }
}
