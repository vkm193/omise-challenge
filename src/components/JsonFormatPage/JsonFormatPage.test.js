import React from 'react';
import { shallow } from 'enzyme';
import '../../setupTests';
import JsonFormatPage from './JsonFormatPage';
import { inputJson, outputJson, inputJson2 } from './JsonMock';

describe('<JsonFormatPage />', () => {
    it('should not show output box', () => {
        const wrapper = shallow(<JsonFormatPage />);
        expect(wrapper.find('#input-box')).toHaveLength(1);
    });

    it('should not show output box', () => {
        const wrapper = shallow(<JsonFormatPage />);
        wrapper.setState({formattedJson: ''});
        expect(wrapper.find('#output-box')).toHaveLength(0);
    });

    it('should show output box', () => {
        const wrapper = shallow(<JsonFormatPage />);
        wrapper.setState({formattedJson: 'Not a json string'});
        expect(wrapper.find('#output-box')).toHaveLength(1);
        expect(wrapper.find('#output-box').text()).toMatch('Not a json string');
    });

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
})

