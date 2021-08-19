import React, { Component } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import Modal from "./modal2";
import './style.css';

export default class TextInputField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    };
  }

  handleChange = event => {
    this.props.updateValue(this.props.attributes.name, event.target.value);
  };

  handleSubmit=(e)=> {
    this.modalClose();
  }

  modalOpen=()=> {
    this.setState({ modal: true });
  }


  modalClose=()=> {
    this.setState({
      modal: false
    });
  }

  render() {
    const { attributes } = this.props;
    const disableCondition =
      (this.props.formSubmissionType === 'update' && !attributes.editable) ||
      (attributes['type'] === 'auto-incr-number' && !attributes.editable) ||
      (attributes && attributes['expression']);
    const value = attributes['value'] || '';
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <p style={{ fontSize: 16, margin: 0 }}>
            {attributes['label']} {attributes['required'] ? `*` : ''} :
          </p>
          {attributes['error'] && (
            <p
              id="error"
              style={{
                color: 'red',
                fontSize: 12,
                margin: 0,
              }}
            >
              {attributes['errorMsg']}
            </p>
          )}
        </div>
        <div
          style={{
            height: '45px',
            width: '100%',
            border: '1px solid #979797',
            borderRadius: 5,
            fontSize: 20,
          }}
          onClick={()=>this.modalOpen()}
        ></div>
      <Modal title="My Modal" onClose={() => this.modalClose()} show={this.state.modal}>
      <SignatureCanvas penColor='green'
    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} />
      </Modal>
      </div>
    );
  }
}
