import React from "react";

import '../style.css';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal dblock" : "modal dnone";

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
        {children}
        <a className="modal-close" onClick={handleClose}>
          close
        </a>
      </div>
    </div>
  );
};

export default Modal;
