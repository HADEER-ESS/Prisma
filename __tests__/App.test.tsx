/**
 * @format
 */

import React from 'react';
import App from '../App';
import { render } from '@testing-library/react-native';

test('renders correctly', async () => {
  const root = render(<App />)
  expect(root).toBeTruthy();

});
