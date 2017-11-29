import React from 'react';
import Renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createMockStore } from 'redux-test-utils';

import { Form, Field, Button } from './index';

Enzyme.configure({ adapter: new Adapter() });

test('Button uses properties', () => {
  const component = Renderer.create(
    <Button text="Button" />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Button click sends onClick', () => {
  const onClick = jest.fn();
  const component = shallow(<Button text="Button" onClick={onClick} />);

  component.simulate('click');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('Form submit sends onSubmit', () => {
  const onSubmit = jest.fn();
  const component = shallow(
    <Form name="test" onSubmit={onSubmit} />,
    { context: {
      store: createMockStore({ fields: {} }),
    } }
  );

  component.simulate('submit');
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('Field uses value from store', () => {
  const component = mount(
    <Field form="test" name="test" validation={{}} />,
    { context: {
      store: createMockStore({ fields: { test: { test: 'Test' } } }),
    } }
  );

  const props = component.find('input').props();
  expect(props.value).toBe('Test');
});
