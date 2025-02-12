import React from 'react';
import { Cell } from './cell';

const Row = ({
  data,
  widthArr,
  height,
  backgroundColor,
  rowNumber,
  toggleEditModal,
}) => {
  const width = widthArr ? widthArr.reduce((a, b) => a + b, 0) : 0;

  return data.length ? (
    <div
      style={{
        display: 'flex',
        height: height || 'auto',
        width: width || '100%',
        backgroundColor: backgroundColor || 'transparent',
        cursor: 'pointer',
      }}
      onClick={() =>
        typeof toggleEditModal === 'function' &&
        toggleEditModal(data, rowNumber)
      }
    >
      {data.map((item, i) => {
        const wth = widthArr && widthArr[i];
        return (
          <div
            key={`${item['rowKey']}${item['colKey']}`}
            style={{ width: wth, height }}
          >
            <Cell
              type={item['type']}
              value={item['value']}
              width={wth}
              height={height}
              color={'black'}
              keyIndex={`${item['rowKey']}${item['colKey']}`}
            />
          </div>
        );
      })}
    </div>
  ) : null;
};

const Rows = ({ data, theme, toggleEditModal, widthArr, height }) => {
  return data ? (
    <div style={{ paddingTop: 1 }}>
      {data.map((item, i) => (
        <div key={i.toString()}>
          <Row
            data={item['data']}
            theme={theme}
            widthArr={widthArr}
            height={height}
            backgroundColor={i % 2 === 0 ? '#E1FBFF' : 'white'}
            toggleEditModal={toggleEditModal}
            rowNumber={i + 1}
          />
        </div>
      ))}
    </div>
  ) : null;
};

export { Row, Rows };
