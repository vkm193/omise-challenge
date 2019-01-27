import React from 'react';
import { shallow } from 'enzyme';
import '../../setupTests';
import JsonFormatPage from './JsonFormatPage';
import { inputJson, outputJson, inputJson2 } from './JsonMock';

it('Should match output JSON', () => {
    const wrapper = shallow(<JsonFormatPage />);
    expect(wrapper.state('formattedJson')).toBe('');
    wrapper.find('textarea').simulate('change', {target: {value: inputJson}});
    expect(JSON.parse(wrapper.state('formattedJson'))).toEqual(JSON.parse(outputJson));
});

it('Should not match output JSON', () => {
    const wrapper = shallow(<JsonFormatPage />);
    expect(wrapper.state('formattedJson')).toBe('');
    wrapper.find('textarea').simulate('change', {target: {value: inputJson2}});
    expect(JSON.parse(wrapper.state('formattedJson'))).not.toEqual(JSON.parse(outputJson));
});
