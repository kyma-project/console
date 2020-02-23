import React from 'react';
import renderer from 'react-test-renderer';

import { lambda } from './mocks';
import ConfigurationForm from '../ConfigurationForm';

describe('Lambda Configuration Form', () => {
  const emptyRef = { current: null };
  const labelEditorMock = <p>Label Editor Mock</p>;

  it('Render with minimal props', () => {
    const component = renderer.create(
      <ConfigurationForm
        lambda={lambda}
        sizeRef={emptyRef}
        runtimeRef={emptyRef}
        LabelsEditor={labelEditorMock}
        formRef={{ current: null }}
      />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
