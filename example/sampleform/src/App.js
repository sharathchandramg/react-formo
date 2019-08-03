import React, { Component } from 'react';
import './App.css';
const fields = require("./schema/00-basic_types.json");
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
		console.log('====================================');
		console.log(this.state.fields);
		console.log('====================================');
		return (
			<div className="App">
				<Form fields ={this.state.fields} formData={this.state.formData} />
			</div>
		);
	}

}

export default App;
