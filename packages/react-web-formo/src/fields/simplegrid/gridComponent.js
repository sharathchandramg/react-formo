import React from 'react';

import { Row, Rows } from './rows';
import { Table, TableWrapper } from './table';
import { Col } from './cols';

const GridComponent = ({
  attributes,
  toggleEditModal,
  handleOnDoneClick,
  data,
  summary,
  tableHeader,
  rowHeight,
  widthArr,
  rowTitle,
  tableData,
}) => {
  const headerWidthArr = [100, ...widthArr];

  const renderGridView = () => {
    return (
      <div style={{ overflowX: 'auto' }}>
        <div>
          <Table>
            <Row
              data={tableHeader}
              widthArr={headerWidthArr}
              height={rowHeight}
              backgroundColor={'#48BBEC'}
              rowNumber={0}
            />
          </Table>
          <div style={{ marginTop: '-1px' }}>
            <TableWrapper style={{ display: 'flex' }}>
              <Table>
                <Col
                  data={rowTitle}
                  theme={attributes.theme}
                  wth={headerWidthArr[0]}
                  height={rowHeight}
                />
              </Table>
              <div>
                <Rows
                  data={tableData}
                  theme={attributes.theme}
                  toggleEditModal={toggleEditModal}
                  widthArr={widthArr}
                  height={rowHeight}
                />
              </div>
            </TableWrapper>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ marginBottom: '150px', flex: 1 }}>
        <div>{data && Object.keys(data).length ? renderGridView() : null}</div>
      </div>
      <div
        style={{
          height: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid #d6d7da',
        }}
      >
        <div>
          <p
            style={{ fontSize: '14px', color: '#989898', textAlign: 'center' }}
          >
            {summary ? summary : ''}
          </p>
        </div>
      </div>
      <button
        style={{
          height: '50px',
          width: '100%',
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
  );
};

export default GridComponent;
