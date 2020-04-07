import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { useQueue } from '../useQueue';

const countValueTestID = 'count';
const buttonTestID = 'button';

const TestComponent = () => {
  const [count, setCount] = useState(0);
  function processQueue(_, done) {
    setTimeout(() => {
      setCount(c => c + 1);
      done();
    }, 200);
  }
  const [addToQueue] = useQueue(processQueue);

  return (
    <div>
      <p data-testid={countValueTestID}>{count}</p>
      <button
        data-testid={buttonTestID}
        type="button"
        onClick={() => addToQueue({})}
      >
        Increase with 1000ms delay
      </button>
    </div>
  );
};

describe('useQueue', () => {
  test.todo('update count state with queue');
  // TODO: Investigate why it fails on CI, but locally always passes - problems with timers.
  // it('update count state with queue', async () => {
  //   jest.useFakeTimers();
  //   const { findByTestId } = render(<TestComponent />);

  //   let countValue = await findByTestId(countValueTestID);
  //   expect(countValue.textContent).toEqual('0');

  //   const button = await findByTestId(buttonTestID);
  //   fireEvent.click(button);
  //   fireEvent.click(button);
  //   fireEvent.click(button);

  //   countValue = await findByTestId(countValueTestID);
  //   expect(countValue.textContent).toEqual('0');

  //   act(() => {
  //     jest.runTimersToTime(200);
  //   });

  //   countValue = await findByTestId(countValueTestID);
  //   expect(countValue.textContent).toEqual('1');

  //   act(() => {
  //     jest.runAllTimers();
  //   });

  //   countValue = await findByTestId(countValueTestID);
  //   expect(countValue.textContent).toEqual('3');
  // });
});
