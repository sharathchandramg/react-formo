import React from 'react';

const Table = ({ borderStyle, children }) => {
  const renderChildren = () => {
    return React.Children.map(children, (child) =>
      React.cloneElement(
        child,
        borderStyle && child.type !== 'table' ? { borderStyle } : {}
      )
    );
  };

  const backgroundColor = borderStyle?.backgroundColor || '';

  return (
    <div style={{ ...styles.tableStyle, backgroundColor }}>
      {renderChildren()}
    </div>
  );
};

const TableWrapper = ({ borderStyle, children }) => {
  const renderChildren = () => {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, borderStyle ? { borderStyle } : {})
    );
  };

  return <div>{renderChildren()}</div>;
};

const styles = {
  tableStyle: {
    borderLeft: '0.5px solid #BDCCDB',
    borderBottom: '0.5px solid #BDCCDB',
    display: 'table',
    width: '100%',
  },
};

export { Table, TableWrapper };
