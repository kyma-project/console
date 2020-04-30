import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useLogsView } from '../useLogsView';

const nameButtonTestID = 'name-button-id';
const namespaceButtonTestID = 'namespace-button-id';
const tabButtonTestID = 'tab-button-id';

const mockPathExists = jest.fn(() => Promise.resolve(true));
const mockCollapse = jest.fn();
const mockExpand = jest.fn();
const mockOpenAsSplitView = jest.fn(() => ({
  collapse: mockCollapse,
  expand: mockExpand,
}));

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: () => ({
      withParams: () => ({
        pathExists: mockPathExists,
        openAsSplitView: mockOpenAsSplitView,
      }),
    }),
  };
});

const TestComponent = () => {
  const [uid, setUid] = useState('test-uid');
  const [namespace, setNamespace] = useState('test-namespace');
  const [tab, setTab] = useState('Configuration');

  useLogsView(name, namespace, tab);

  return (
    <div>
      <button data-testid={nameButtonTestID} onClick={() => setUid(`${uid}-1`)}>
        {name}
      </button>
      <button
        data-testid={namespaceButtonTestID}
        onClick={() => setNamespace(`${namespace}-1`)}
      >
        {namespace}
      </button>
      <button
        data-testid={tabButtonTestID}
        onClick={() =>
          setTab(tab === 'Configuration' ? 'test' : 'Configuration')
        }
      >
        {tab}
      </button>
    </div>
  );
};

describe('useLogsView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly calls mocked functions', async () => {
    const { findByTestId, unmount } = render(<TestComponent />);

    const nsButton = await findByTestId(namespaceButtonTestID);
    const tabButton = await findByTestId(tabButtonTestID);
    expect(mockPathExists).toHaveBeenCalledTimes(2);
    expect(mockCollapse).toHaveBeenCalledTimes(1);
    expect(mockExpand).toHaveBeenCalledTimes(0);
    expect(mockOpenAsSplitView).toHaveBeenCalledTimes(1);

    expect(nsButton.textContent).toEqual('test-namespace');

    act(() => {
      fireEvent.click(nsButton);
    });

    expect(mockPathExists).toHaveBeenCalledTimes(3);
    expect(mockCollapse).toHaveBeenCalledTimes(3);
    expect(mockExpand).toHaveBeenCalledTimes(0);
    expect(mockOpenAsSplitView).toHaveBeenCalledTimes(2);
    expect(nsButton.textContent).toEqual('test-namespace-1');

    expect(tabButton.textContent).toEqual('Configuration');
    act(() => {
      fireEvent.click(tabButton);
    });
    expect(tabButton.textContent).toEqual('test');

    expect(mockPathExists).toHaveBeenCalledTimes(3);
    expect(mockCollapse).toHaveBeenCalledTimes(3);
    expect(mockExpand).toHaveBeenCalledTimes(0);
    expect(mockOpenAsSplitView).toHaveBeenCalledTimes(2);

    unmount();

    expect(mockCollapse).toHaveBeenCalledTimes(4);
  });
});
