import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';

describe(App, () => {
    it('Renders App', () => {
        const app = shallow(<App />);
        expect(App).toMatchSnapshot();
    });

    it('should call function when submit button is clicked', () => {
        const wrapper = mount(<App />);
        const submitBtn = wrapper.find('button.subBtn');
        submitBtn.simulate('click');
        const text = wrapper.find('#error').text();
        expect(text).toEqual('Phone Number is required');
    });

    it('should call function when validate button is clicked', () => {
        const wrapper = mount(<App />);
        const validateBtn = wrapper.find('button.vldBtn');
        validateBtn.simulate('click');
        const text = wrapper.find('#error').text();
        expect(text).toEqual('Phone Number is required');
    });

    it('should validate the input when submit button is clicked', () => {
        const newValue = 'testing component';
        const wrapper = mount(<App />);
        const input = wrapper.find('input');
        input.simulate('change', { target: { value: newValue } });
        const submitBtn = wrapper.find('button.subBtn');
        submitBtn.simulate('click');
        const text = wrapper.find('#error').text();
        expect(text).toEqual('Phone Number should be valid mobile number');
    });
});
