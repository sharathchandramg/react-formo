// import React from 'react';
// import { shallow, mount } from 'enzyme';
// import FormO from '../index';
// import TextInputField from '../fields/textInput/index';

// const dataSourceTestSchema = {
//   type: 'text',
//   name: 'data_source',
//   label: 'Data Source',
//   required: true,
//   editable: true,
//   hidden: false,
// };
// //                     case 'email':
// const emailTestData = [
//   {
//     type: 'email',
//     name: 'email',
//     label: 'Email',
//     required: true,
//     editable: true,
//     hidden: false,
//   },
// ];
// //                     case 'number':
// const numberData = [
//   {
//     type: 'number',
//     name: 'number_of_flats',
//     label: 'Number Of Flats',
//     required: true,
//     editable: true,
//     hidden: false,
//   },
// ];

// //                     case 'url':
// const urlTestData = [
//   {
//     type: 'url',
//     name: 'url',
//     label: 'URL',
//     required: true,
//     editable: true,
//     hidden: false,
//   },
// ];

// //                     case 'phone':
// const phoneTestData = [
//   {
//     type: 'phone',
//     name: 'phone_number',
//     label: 'Phone Number',
//     required: true,
//     editable: true,
//     hidden: false,
//   },
// ];

// const fields = require('../../schema/00-basic_types.json');
// const fields1 = require('../../schema/01-phone-and-email.json');

// describe(FormO, () => {
//   it('Renders FormO with schema 00-basic_types', () => {
//     mount(<FormO fields={fields} />);
//     expect(FormO).toMatchSnapshot();
//   });
//   it('Renders FormO with phone-and-email', () => {
//     mount(<FormO fields={fields1} />);
//     expect(FormO).toMatchSnapshot();
//   });

//   //                     case 'mobNumber':
//   it('On changing value Validation triggers', () => {
//     const newValue = 'testing component';
//     const inputField = mount(<FormO fields={phoneTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField.find('#error').text();
//     expect(text).toEqual('Phone Number should be valid mobile number');
//   });

//   it('checks the first digit value in mobile number', () => {
//     const newValue = '0987654321';
//     const inputField = mount(<FormO fields={phoneTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField.find('#error').text();
//     expect(text).toEqual('Phone Number should be valid mobile number');
//   });

//   it('checks the first digit value in mobile number', () => {
//     const newValue = '876543210';
//     const inputField = mount(<FormO fields={phoneTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField.find('#error').text();
//     expect(text).toEqual('Phone Number should be valid mobile number');
//   });
//   //                     case 'number':
//   it('checks wheater it is number is not', () => {
//     const newValue = '8765e';
//     const inputField = mount(<FormO fields={numberData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField
//       .render()
//       .find('#error')
//       .text();
//     expect(text).toEqual('Number Of Flats should be a number');
//   });

//   it('checks wheater it is number is not', () => {
//     const newValue = '8765.99.5';
//     const inputField = mount(<FormO fields={numberData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField
//       .render()
//       .find('#error')
//       .text();
//     expect(text).toEqual('Number Of Flats should be a number');
//   });

//   //                     case 'email':
//   it('checks wheater it is email is not', () => {
//     const newValue = '8765@ffff';
//     const inputField = mount(<FormO fields={emailTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField
//       .render()
//       .find('#error')
//       .text();
//     expect(text).toEqual('Please enter a valid email');
//   });

//   it('checks wheater it is email is not', () => {
//     const newValue = 'inkm5@ffff.com.';
//     const inputField = mount(<FormO fields={emailTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField
//       .render()
//       .find('#error')
//       .text();
//     expect(text).toEqual('Please enter a valid email');
//   });

//   //                     case 'url':
//   it('checks wheater it is url is valid or not', () => {
//     const newValue = 'localhost:3000';
//     const inputField = mount(<FormO fields={urlTestData} />);
//     const input = inputField.find('input');
//     input.simulate('change', { target: { value: newValue } });
//     const text = inputField
//       .render()
//       .find('#error')
//       .text();
//     expect(text).toEqual('URL should be valid url');
//   });
// });

// describe(TextInputField, () => {
//   it('Renders text Input field', () => {
//     const inputField = shallow(
//       <TextInputField attributes={dataSourceTestSchema} />
//     );
//     expect(TextInputField).toMatchSnapshot();
//   });
//   it('Renders number Input field', () => {
//     const inputField = shallow(<TextInputField attributes={numberData} />);
//     expect(TextInputField).toMatchSnapshot();
//   });
// });
