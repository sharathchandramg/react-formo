import React, { Component } from 'react';
import PropTypes from "prop-types";
import TextInputField from "./fields/textInput/index.js";
import styles from "./styles.css"
import { autoValidate, getDefaultValue, getResetValue } from "./utils/helper";

const _ = require("lodash");

const DefaultErrorComponent = (props) => {
    const attributes = props.attributes;
    const theme = props.theme;
    if (attributes.error) {
        return (
            <p style={{ color: theme.errorMsgColor }}>
                {attributes.errorMsg}
            </p>
        );
    }
    return null;
};

export default class FormO extends Component {

	constructor(props) {
		super(props);
		const initialState = this.getInitialState(props.fields);

        this.state = {
            ...initialState,
            formData:{},
            errorStatus: false
        }

    }
    
    componentDidMount() {
        const { formData } = this.props;
        this.setValues(formData);
    }

    componentDidUpdate(prevProps) {
        const { formData } = this.props;
        if (prevProps !== this.props) {
            this.setValues(formData);
        }
    }
    
	getInitialState(fields) {
		const state = {};
		fields.forEach((field,index)=>{
			const fieldObj = field;
			fieldObj.error = false;
			fieldObj.errorMsg = '';
			if (field && field.type) {
				fieldObj.value = '';
				state[field.name] = fieldObj;
			}
		})
		return state;
    }
    
    onValidateFields() {
        const newFields = {};
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                if (field.required !== undefined && field.required) {
                    let validate = autoValidate(field);
                    field.error = validate.error;
                    field.errorMsg = validate.errorMsg;
                }
                
                newFields[field.name] = field;
            }
        });
        this.setState({ ...newFields });
    }

    onAddNewFields(name, newObj) {
        let fieldObj = this.state[name];
        if (fieldObj) {
            if (fieldObj.type === 'sub-form') {
                if (typeof fieldObj.value === 'undefined' || fieldObj.value === null || fieldObj.value.length === 0) {
                    fieldObj.value = [newObj];
                } else {
                    let gIndex = _.indexOf(Object.keys(this.state), fieldObj.name);
                    let newValue;
                    if (gIndex !== -1) {
                        let preValue = Object.values(this.state)[gIndex].value;
                        let oIndex = _.findIndex(preValue, item => item._id === newObj._id);
                        if (oIndex !== -1) {
                            preValue[oIndex] = newObj;
                            newValue = preValue;
                        } else {
                            newValue =  _.concat(newObj, preValue);
                        }
                    } else {
                        newValue = [newObj];
                    }
                    fieldObj.value = newValue;
                }
                const newField = {};
                newField[fieldObj.name] = fieldObj;
                this.setState({ ...newField });
            }
        }
    }


    resetForm() {
        const newFields = {};
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                field.value = (field.editable !== undefined && !field.editable) ?
                    getDefaultValue(field) :
                    getResetValue(field);
                field.error = false;
                field.errorMsg = '';
                if (field.type === 'group') {
                    this[field.name].group.resetForm();
                }
                newFields[field.name] = field;
            }
        });
        this.setState({ ...newFields });
    }


    onValueChange(name, value) {
        const valueObj = this.state[name];
        if (valueObj) {
            if (valueObj.type !== 'sub-form') {
                valueObj.value = value;
                //autovalidate the fields
                if (this.props.autoValidation === undefined || this.props.autoValidation) {
                    Object.assign(valueObj, autoValidate(valueObj));
                }
                // apply some custom logic for validation
                if (this.props.customValidation
                    && typeof this.props.customValidation === 'function') {
                    Object.assign(valueObj, this.props.customValidation(valueObj));
                }
                const newField = {};
                newField[valueObj.name] = valueObj;
                if (this.props.onValueChange &&
                    typeof this.props.onValueChange === 'function') {
                    this.setState({ ...newField }, () => this.props.onValueChange());
                } else {
                    this.setState({ ...newField });
                }
            }
        }
    }

    onSummitTextInput(name) {
        const index = Object.keys(this.state).indexOf(name);
        if (index !== -1 && this[Object.keys(this.state)[index + 1]]
            && this[Object.keys(this.state)[index + 1]].textInput) {
            this[Object.keys(this.state)[index + 1]].textInput._root.focus();
        } 
    }

    getValues() {
        this.onValidateFields();
        const values = {};
        let isValidFields = true;
        Object.keys(this.state).forEach((fieldName) => {
            const field = this.state[fieldName];
            if (field) {
                if (field.error !== undefined && field.error) {
                    isValidFields = false;
                }
                values[field.name] = field.type && field.type.match(/number/i) ? parseFloat(field.value) : field.value;
            }
        });
        if (isValidFields) {
            return values;
        } else {
            return null;
        }
    }

    
    getFieldValue(fieldObj, value) {
        const field = fieldObj;
        if (field.type === 'group') {
            const subFields = {};
            Object.keys(value).forEach((fieldName) => {
                subFields[fieldName] = value[fieldName];
            });
            this[field.name].group.setValues(subFields);
            field.value = this[field.name].group.getValues();
        } else {
            field.value = value;
            if (this.props.autoValidation === undefined || this.props.autoValidation) {
                Object.assign(field, autoValidate(field));
            }
            if (this.props.customValidation
                && typeof this.props.customValidation === 'function') {
                Object.assign(field, this.props.customValidation(field));
            }
        }
        return field;
    }


    setValues(...args) {
        if (args && args.length && args[0]) {
            const newFields = {};
            Object.keys(args[0]).forEach((fieldName) => {
                const field = this.state[fieldName];
                if (field) {
                    newFields[field.name] = this.getFieldValue(field, args[0][fieldName]);
                }
            });
            this.setState({ ...newFields });
        }
    }


	onValueChange (name,value){
		const valueObj = this.state[name];
		if (valueObj) {
            if (valueObj.type !== 'sub-form') {
                valueObj.value = value;
                const newField = {};
                newField[valueObj.name] = valueObj;
                if (this.props.onValueChange &&
                    typeof this.props.onValueChange === 'function') {
                    this.setState({ ...newField }, () => this.props.onValueChange());
                } else {
                    this.setState({ ...newField });
                }
            }
        }
	}
	generateFields (){
        let formKeys = Object.keys(this.state);
        const { customComponents, errorComponent } = this.props;
        const renderFields = formKeys.map((fieldName,index)=>{
            const field = this.state[fieldName];
            if (!field.hidden) {
				const commonProps = {
                    key: index,
                    attributes: this.state[field.name],
                    updateValue: this.onValueChange,
                    onAddNewFields: this.onAddNewFields,
                    getValue: this.getValue,
                    // ErrorComponent: errorComponent || DefaultErrorComponent,
                    navigation: this.props['navigation']|| null
                };

                switch (field.type) {
                    case "text":
                    case "email":
                    case "number":
                    case "url":
                    case "mobNumber":
                    case "password":
                    case "phone":
                    case "calculated":
                        return <TextInputField
							ref={(c) => { this[field.name] = c; }}
							{...commonProps}
                            onSummitTextInput={this.onSummitTextInput}
						/>

					default:
                        return null;
				}
            }
        });
        return renderFields;

    }

	render() {
		return (
			<div className="mainForm" >
                {this.generateFields()}	
			</div>
		);
	}
}

