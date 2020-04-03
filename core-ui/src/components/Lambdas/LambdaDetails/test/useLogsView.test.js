import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useLogsView } from '../useLogsView';

const nameButtonTestID = 'name-button-id';
const namespaceButtonTestID = 'namespace-button-id';
const tabButtonTestID = 'tab-button-id';

const mockAsync = jest.fn(() => Promise.resolve(true));
const mockCollapse = jest.fn();
const mockExpand = jest.fn();

jest.mock('@kyma-project/luigi-client', () => {
  return {
    linkManager: () => ({
      withParams: () => ({
        pathExists: mockAsync,
        openAsSplitView: () => ({
          collapse: mockCollapse,
          expand: mockExpand,
        }),
      }),
    }),
  };
});

const TestComponent = () => {
  const [name, setName] = useState('test-name');
  const [namespace, setNamespace] = useState('test-namespace');
  const [tab, setTab] = useState('Configuration');

  useLogsView(name, namespace, tab);

  return (
    <div>
      <button
        data-testid={nameButtonTestID}
        onClick={() => setName(`${name}-1`)}
      >
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

describe('useStateWithCallback', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockAsync.mockReset();
    mockCollapse.mockReset();
    mockExpand.mockReset();
  });

  it('works the same as useState without callback', async () => {
    const { findByTestId, unmount } = render(<TestComponent />);

    const nsButton = await findByTestId(namespaceButtonTestID);
    const tabButton = await findByTestId(tabButtonTestID);
    expect(mockAsync).toHaveBeenCalledTimes(2);
    expect(mockCollapse).toHaveBeenCalledTimes(1);
    expect(mockExpand).toHaveBeenCalledTimes(0);

    expect(nsButton.textContent).toEqual('test-namespace');

    act(() => {
      fireEvent.click(nsButton);
    });

    expect(mockAsync).toHaveBeenCalledTimes(3);
    expect(mockCollapse).toHaveBeenCalledTimes(3);
    expect(mockExpand).toHaveBeenCalledTimes(0);
    expect(nsButton.textContent).toEqual('test-namespace-1');

    expect(tabButton.textContent).toEqual('Configuration');
    act(() => {
      fireEvent.click(tabButton);
    });

    expect(mockAsync).toHaveBeenCalledTimes(4);
    expect(mockCollapse).toHaveBeenCalledTimes(4);
    expect(mockExpand).toHaveBeenCalledTimes(1);
    expect(tabButton.textContent).toEqual('test');

    unmount();

    expect(mockCollapse).toHaveBeenCalledTimes(5);
  });

  //   it('works the same as useState with callback', async () => {
  //     const { findByTestId } = render(<TestComponent useCallback={true} />);

  //     let countValue = await findByTestId(countValueTestID);
  //     expect(countValue.textContent).toEqual('0');

  //     const button = await findByTestId(buttonTestID);
  //     fireEvent.click(button);

  //     countValue = await findByTestId(countValueTestID);
  //     expect(countValue.textContent).toEqual('2');
  //   });
});
