import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../components/app';

Enzyme.configure({ adapter: new Adapter() });

// Use describe() for logical grouping 
describe('Index Tests', () => {

    // it() or test(), they are aliases of each other
    it('Just to make sure Jest works, 1 + 2 = 3', () => {
        expect(1 + 2).toEqual(3);   // Basic test using toEqual matcher
    });

    it('Smoke test to render <App/>, check if an exception is thrown', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
    });

});


