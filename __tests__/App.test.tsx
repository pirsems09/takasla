/**
 * @format
 */

import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';

test('renders correctly', async () => {
  await renderer.act(() => {
    renderer.create(<App />);
  });
});
