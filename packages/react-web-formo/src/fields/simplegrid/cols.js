import React from 'react';
import { Cell } from './cell';

const Col = ({ data, wth, height }) => {
  return data ? (
    <div>
      {data.map((item, i) => (
        <div
          key={`${item['rowKey']}`}
          style={{
            backgroundColor: i % 2 === 0 ? '#E1FBFF' : 'white',
            color: '#989898',
          }}
        >
          <Cell
            type={item['type']}
            value={item['value']}
            width={wth}
            height={height}
            color={'black'}
            keyIndex={`${item['rowKey']}`}
          />
        </div>
      ))}
    </div>
  ) : null;
};

export { Col };
