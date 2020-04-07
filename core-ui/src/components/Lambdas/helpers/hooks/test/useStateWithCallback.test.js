import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { useStateWithCallback } from '../useStateWithCallback';

const countValueTestID = 'count';
const buttonTestID = 'button';

const TestComponent = ({ useCallback = false }) => {
  const [count, setState] = useStateWithCallback(0);

  function setCount(state) {
    if (useCallback) {
      setState(state, () => {
        setState(state + 1);
      });
    } else {
      setState(state);
    }
  }

  return (
    <div>
      <p data-testid={countValueTestID}>{count}</p>
      <button
        data-testid={buttonTestID}
        type="button"
        onClick={() => setCount(count + 1)}
      >
        Increase
      </button>
    </div>
  );
};

describe('useStateWithCallback', () => {
  it('works the same as useState without callback', async () => {
    const { findByTestId } = render(<TestComponent />);

    let countValue = await findByTestId(countValueTestID);
    expect(countValue.textContent).toEqual('0');

    const button = await findByTestId(buttonTestID);
    fireEvent.click(button);

    countValue = await findByTestId(countValueTestID);
    expect(countValue.textContent).toEqual('1');
  });

  it('works the same as useState with callback', async () => {
    const { findByTestId } = render(<TestComponent useCallback={true} />);

    let countValue = await findByTestId(countValueTestID);
    expect(countValue.textContent).toEqual('0');

    const button = await findByTestId(buttonTestID);
    fireEvent.click(button);

    countValue = await findByTestId(countValueTestID);
    expect(countValue.textContent).toEqual('2');
  });
});
