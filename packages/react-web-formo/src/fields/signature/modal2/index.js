import React from "react";
import { CSSTransition } from "react-transition-group";
import "./modal.css";


class Modal extends React.Component {
  componentDidMount() {
    document.addEventListener("keydown", this.closeOnEscapeKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.closeOnEscapeKeyDown);
  }

  closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      this.props.onClose();
    }
  };

  render(){
    return <CSSTransition
      in={this.props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={this.props.onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{this.props.title}</h4>
          </div>
          <div className="modal-body">{this.props.children}</div>
          <div className="modal-footer">
            <button onClick={this.props.onClose} className="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  }
};

export default Modal;
