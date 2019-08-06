import React, { Component } from 'react';
import './App.css';
const fields = require("./schema/01-phone-and-email.json");
import Form from "react-jsonSchema-formo";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fields: fields,
			formData: {},

		}
	}
	
	render() {
		return (
			<div className="App">
				<Form className="form" ref ={(c)=> this.formGenerator = c} fields ={this.state.fields} formData={this.state.formData} />
				<div className="buttons">
					<button
						className="button subBtn"
                        type="button"
						onClick={() =>(this.formGenerator.getValues())}
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
						onClick={() => (this.formGenerator.onValidateFields())}
					>
						Validate Form
					</button>
				</div>
			</div>
		);
	}

}

export default App;