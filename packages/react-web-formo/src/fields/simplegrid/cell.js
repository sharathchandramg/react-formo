import React from 'react';

const Cell = ({ keyIndex, type, value, width, height, color }) => {
  const textboxStyle = {
    color: color || 'black',
    height: height || 'auto',
    textAlign: 'center',
    padding: '5px',
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
      }}
      key={keyIndex}
    >
      <span style={textboxStyle}>{value}</span>
    </div>
  );
};

export { Cell };
