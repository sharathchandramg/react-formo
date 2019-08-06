import React from "react";
import { shallow } from 'enzyme';
import App from "../App";

describe(App,()=>{
  it('Renders App', () => {
    const app = shallow(<App />);
    expect(App).toMatchSnapshot();
  });

  it('Renders text input area',()=>{
    const app= shallow(<App/>);
    
  })

  it('Renders text input area with email and phone',()=>{
    const app= shallow(<App/>);
    const expectedOutput='<div>'+'<label>'+'<div>'+'<p>'+'</p>'+'</div>'+'<input type:"text"/>'+'</label>'+'</div>'
    +'<div>'+'<label>'+'<div>'+'<p>'+'</p>'+'</div>'+'<input type:"text"/>'+'</label>'+'</div>'+
    '<div>'+'<label>'+'<div>'+'<p>'+'</p>'+'</div>'+'<input type:"phone"/>'+'</label>'+'</div>'+
    '<div>'+'<label>'+'<div>'+'<p>'+'</p>'+'</div>'+'<input type:"email"/>'+'</label>'+'</div>';

    const realOutput=app.find('div.form').html();
    expect(realOutput.indexOf(expectedOutput)>-1).toEqual(true);
  })
});