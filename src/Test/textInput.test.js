import React from 'react';
import { shallow, mount } from 'enzyme';
import FormO from '../index';
import TextInputField from '../fields/textInput/index';

const testSchema = {
    type: 'text',
    name: 'data_source',
    label: 'Data Source',
    required: true,
    editable: true,
    hidden: false,
};

const fields = require('../../schema/00-basic_types.json');
const fields1 = require('../../schema/01-phone-and-email.json');

describe(FormO, () => {
    it('Renders FormO with schema 00-basic_types', () => {
        const form = mount(<FormO fields={fields} />);
        expect(FormO).toMatchSnapshot();
    });
    it('Renders FormO with phone-and-email', () => {
        const form = mount(<FormO fields={fields1} />);
        expect(FormO).toMatchSnapshot();
    });
});

describe(TextInputField, () => {
    it('Renders text Input field', () => {
        const inputField = shallow(<TextInputField attributes={testSchema} />);
        expect(TextInputField).toMatchSnapshot();
    });
});
