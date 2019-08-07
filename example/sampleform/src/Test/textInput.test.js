import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
//  const data = require("../../../schema/00-basic_types.json");

const testData = {
    type: 'phone',
    name: 'phone_number',
    label: 'Phone Number',
    required: true,
    editable: true,
    hidden: false,
};

describe(App, () => {
    it('Renders App', () => {
        const app = shallow(<App />);
        expect(App).toMatchSnapshot();
    });

    it('should call function when submit button is clicked', () => {
        const wrapper = mount(<App />);
        const submitBtn = wrapper.find('button.subBtn');
        submitBtn.simulate('click');
        console.log(wrapper.render().find('.error_msg'));
        // const text = wrapper.render().find('p.error').text()
        // expect(text).toEqual('Phone Number is required');
    });

    it('should call function when validate button is clicked', () => {
        const wrapper = mount(<App />);
        const validateBtn = wrapper.find('button.vldBtn');
        validateBtn.simulate('click');
        // const text = wrapper.find('p.error').text();
        // expect(text).toEqual('Phone Number is required');
    });
});
