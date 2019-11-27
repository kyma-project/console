import { instanceAllAttributes } from './mocks';
import { StatusPanel } from '../StatusPanel';
import { render } from 'enzyme';
import React from 'react';
const consoleWarn = jest.spyOn(global.console, 'warn').mockImplementation();
afterAll(() => {
  consoleWarn.mockReset();
});
['PROVISIONING', 'FAILED', 'RUNNING'].map(testCase => {
  it(`Render info with status ${testCase}`, () => {
    const instance = instanceAllAttributes;
    instance.status.type = testCase;
    const component = render(<StatusPanel serviceInstance={instance} />);

    expect(component).toMatchSnapshot();
  });
});
