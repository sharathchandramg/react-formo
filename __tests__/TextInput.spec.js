import React from "react";
import { shallow, mount } from 'enzyme';
import FormO from "../src/index";
import TextInputField from "../src/fields/textInput/index";

const testSchema = {
  "type": "text",
  "name": "data_source",
  "label": "Data Source",
  "required": true,
  "editable": true,
  "hidden": false
};

const fields= require("../schema/00-basic_types.json");
// const fields1=require("../example/sampleform/src/schema/01-phone-and-email.json");

describe(FormO,()=>{
  it('Renders FormO',()=>{
    const form = mount(<FormO fields={fields}/>);
    expect(FormO).toMatchSnapshot();
  })
});

describe(TextInputField,()=>{
  it('Renders text Input field',()=>{
    const inputField=shallow(<TextInputField attributes={testSchema} />);
    expect(TextInputField).toMatchSnapshot();
  })
})

