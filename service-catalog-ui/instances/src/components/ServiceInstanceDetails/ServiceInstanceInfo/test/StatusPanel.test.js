import { instanceAllAttributes } from './mocks';
import { StatusPanel } from '../StatusPanel';
import renderer from 'react-test-renderer';
import React from 'react';

['PROVISIONING', 'FAILED', 'RUNNING'].map(testCase => {
  it(`Render info with status ${testCase}`, () => {
    const instance = instanceAllAttributes;
    instance.status.type = testCase;
    const component = renderer.create(
      <StatusPanel serviceInstance={instance} />,
    );

    expect(component).toMatchSnapshot();
  });
});
