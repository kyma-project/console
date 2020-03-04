import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { lambda, mocks } from './mocks';
import Configuration from '../Configuration';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
  };
});

describe('Lambda Configuration Tab', () => {
  const emptyRef = { current: null };
  const text = 'Label Editor Mock';
  const labelEditorMock = <p>{text}</p>;

  it('Render with minimal props', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks}>
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

    expect(getByText(text)).toBeInTheDocument();
  });
});
