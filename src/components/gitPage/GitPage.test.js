import React from 'react';
import { shallow } from 'enzyme';
import '../../setupTests';
import GitPage from './GitPage';

describe('<GitPage />', () => {
    it('should return 100 record on mount', () => {
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            expect(wrapper.state('repositories').length).toEqual(100);
        }, 10000); // Setting timeout 10 seconds, since API is not resolved with jest default 5 seconds timeout
    })
    
    it('Should not render table', () => {
        const wrapper = shallow(<GitPage />);
        expect(wrapper.find('table')).toHaveLength(0);
    });

    it('Should render table', () => {
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            expect(wrapper.find('table')).toHaveLength(1);
        }, 10000); // Setting timeout 10 seconds, since API is not resolved with jest default 5 seconds timeout
    });


    it('should have pagination div', () =>{
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            expect(wrapper.find('.react-bs-table-pagination')).toHaveLength(1);
        }, 10000);
    });
    
    it('should have 10 rows visble', () =>{
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            const rows = wrapper.find('table tbody tr');
            expect(rows.length).toBe(10);
        }, 10000);
    });

    it('should have pagination li', () =>{
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            expect(wrapper.find('.page-item')).toHaveLength(10);
        }, 10000);
    });

    it('should have page item clickable', () =>{
        const wrapper = shallow(<GitPage />);
        wrapper.instance().componentDidMount();
        setTimeout(()=> {
            const page = wrapper.find('.page-item[title="1"]');
            page.simulate('click');
            expect(wrapper.state('repositories').length).toEqual(200);
            const rows = wrapper.find('table tbody tr');
            expect(rows.length).toBe(10);
        }, 10000);
    });

    it('should show error message',() =>{
        const wrapper = shallow(<GitPage />);
        wrapper.setState({repositories: [], isError: true});
        expect(wrapper.find('#error')).toHaveLength(1);
    });

    it('should show loader and not error', () =>{
        const wrapper = shallow(<GitPage />);
        wrapper.setState({repositories: [], isError: false});
        expect(wrapper.find('#error')).toHaveLength(0);
        expect(wrapper.find('.loader')).toHaveLength(1);
    });

})
