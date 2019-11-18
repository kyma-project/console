import React from 'react';
import renderer from 'react-test-renderer';

import { lambda } from './mocks';
import Configuration from '../Configuration';

describe('Lambda Configuration Tab', () => {
  const emptyRef = { current: null };
  const labelEditorMock = <p>Label Editor Mock</p>;

  it('Render with minimal props', () => {
    const component = renderer.create(
      <Configuration
        lambda={lambda}
        sizeRef={emptyRef}
        runtimeRef={emptyRef}
        LabelsEditor={labelEditorMock}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
