import React from 'react';
import Renderer from 'react-test-renderer';

import Overlay from './index';

test('Overlay uses defaults', () => {
  const component = Renderer.create(
    <Overlay />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Overlay uses error code and message', () => {
  const component = Renderer.create(
    <Overlay
      code="404"
      title="This is an error"
      detail="This is more info"
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
