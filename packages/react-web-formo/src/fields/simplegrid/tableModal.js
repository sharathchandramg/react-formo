import React from 'react';
import Modal from 'react-modal';

const TableModal = ({
  modalVisible,
  toggleModal,
  data,
  label,
  summary,
  handleOnDoneClick,
  wrapperRef,
}) => {
  return (
    <Modal
      isOpen={modalVisible}
      onRequestClose={() => toggleModal()}
      className="simple-grid-modal-wrapper"
      overlayClassName="simple-grid-modal-overlay"
    >
      <div className="simple-grid-modal-container">
        <div className="simple-grid-modal-header">
          <p>{label}</p>
          <i
            className="far fa-times-circle close-button"
            onClick={() => toggleModal()}
          />
        </div>
        <div
          className="simple-grid-modal-body"
          ref={(node) => (wrapperRef = node)}
        >
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
                .map(([key, values], index) => {
                  return (
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
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: '#989898',
                  textAlign: 'center',
                  margin: '10px 0',
                }}
              >
                {summary ? summary : ''}
              </p>
            </div>
            <button
              style={{
                height: '50px',
                width: '50%',
                backgroundColor: '#48BBEC',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleOnDoneClick()}
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
