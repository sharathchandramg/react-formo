import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

/**
 * TableModal component renders a modal with a table to display and edit data.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.modalVisible - Determines if the modal is visible.
 * @param {Function} props.toggleModal - Function to toggle the modal visibility.
 * @param {Object} props.data - Data to be displayed in the table.
 * @param {string} props.label - Label to be displayed in the modal header.
 * @param {string} props.summary - Summary text to be displayed in the modal footer.
 * @param {Function} props.handleOnDoneClick - Function to handle the done button click.
 * @param {Function} props.onChangeText - Function to handle text input changes.
 * @param {Object} props.attributes - Additional attributes for the table.
 * @param {Object} props.attributes.data - Data attributes for the table.
 * @param {Object} props.attributes.data.style - Style attributes for the table.
 * @param {number} [props.attributes.data.style.input_length=150] - Maximum length for input fields.
 *
 * @returns {JSX.Element} The TableModal component.
 */
const TableModal = ({
  modalVisible,
  toggleModal,
  data,
  label,
  summary,
  handleOnDoneClick,
  wrapperRef,
  onChangeText,
  attributes = {},
}) => {
  const inputMaxLength =
    attributes &&
    attributes.data &&
    attributes.data.style &&
    attributes.data.style.input_length
      ? attributes.data.style.input_length
      : 150;

  return (
    <Modal
      isOpen={modalVisible}
      onRequestClose={toggleModal}
      className="simple-grid-modal-wrapper"
      overlayClassName="simple-grid-modal-overlay"
    >
      <div className="simple-grid-modal-container" ref={wrapperRef}>
        <div className="simple-grid-modal-header">
          <p>{label}</p>
          <i
            className="far fa-times-circle close-button"
            onClick={toggleModal}
          />
        </div>
        <div className="simple-grid-modal-body">
          <div className="simple-grid-table-wrapper">
            <div className="simple-grid-table-row simple-grid-table-header">
              <div className="simple-grid-table-cell simple-grid-table-header-cell simple-grid-table-header-cell-first-column">
                #
              </div>
              {data &&
                data.header &&
                Object.keys(data.header).map((key) => (
                  <div
                    className="simple-grid-table-cell simple-grid-table-header-cell simple-grid-table-header-cell-field-column"
                    key={key}
                  >
                    {data.header[key]}
                  </div>
                ))}
            </div>

            {/* Render Data Rows */}
            {data &&
              Object.entries(data)
                .filter(
                  ([key]) =>
                    key !== 'header' &&
                    key !== 'type' &&
                    key !== 'style' &&
                    key !== `${String.fromCharCode(931)}`
                )
                .map(([key, values], index) => (
                  <div
                    className="simple-grid-table-row"
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#E1FBFF' : 'white',
                    }}
                  >
                    <div className="simple-grid-table-cell simple-grid-table-cell-first-column">
                      {key}
                    </div>
                    {Object.keys(values).map((field) => (
                      <div className="simple-grid-table-cell" key={field}>
                        <input
                          type="text"
                          className="simple-grid-table-cell-input"
                          defaultValue={values[field]}
                          onChange={(e) =>
                            onChangeText(key, field, e.target.value)
                          }
                          maxLength={inputMaxLength}
                        />
                      </div>
                    ))}
                  </div>
                ))}
          </div>
          <div className="simple-grid-modal-footer">
            <div className="simple-grid-modal-footer-summary-wrapper">
              <p className="simple-grid-modal-footer-summary-label">
                {summary ? summary : ''}
              </p>
            </div>
            <button
              className="simple-grid-modal-footer-done-button"
              onClick={handleOnDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TableModal;
