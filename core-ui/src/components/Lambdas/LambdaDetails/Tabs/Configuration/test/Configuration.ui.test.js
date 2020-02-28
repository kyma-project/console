import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';

import { lambda } from './mocks';
import Configuration from '../Configuration';

describe('Lambda Configuration Tab', () => {
  const emptyRef = { current: null };
  const labelEditorMock = <p>Label Editor Mock</p>;

  it('Render with minimal props', () => {
    const component = renderer.create(
      <MockedProvider>
        <Configuration
          lambda={lambda}
          sizeRef={emptyRef}
          runtimeRef={emptyRef}
          LabelsEditor={labelEditorMock}
          formRef={{ current: null }}
          refetchLambda={() => {}}
        />
      </MockedProvider>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
