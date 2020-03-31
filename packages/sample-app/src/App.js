import React, { Component } from 'react';
import './App.css';
import Form from 'react-web-formo';

const data = require('./schema/22-checklist.json');

const testData = [
  {
    type: 'phone',
    name: 'phone_number',
    label: 'Phone Number',
    required: true,
    editable: true,
    hidden: false,
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: data,
      formData: {},
    };
  }

  render() {
    return (
      <div className="App">
        <div style={{ width: '85%' }}>
          <Form
            className="form"
            ref={c => (this.formGenerator = c)}
            fields={this.state.fields}
            formData={this.state.formData}
          />
        </div>
        <div className="buttons" style={{ justifyContent: 'center' }}>
          <button
            className="button subBtn"
            type="button"
            onClick={() => this.formGenerator.getValues()}
          >
            Submit
          </button>
          <button
            className="button clrBtn"
            type="reset"
            onClick={() => this.formGenerator.resetForm()}
          >
            Clear Form
          </button>
          <button
            className="button vldBtn"
            type="button"
            onClick={() => this.formGenerator.onValidateFields()}
          >
            Validate Form
          </button>
        </div>
      </div>
    );
  }
}

export default App;
