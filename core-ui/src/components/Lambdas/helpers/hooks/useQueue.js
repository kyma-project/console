import { useEffect, useReducer } from 'react';

const actions = {
  ADD: 'ADD',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
};

const initialState = {
  isProcessing: false,
  queue: [],
};

export const useQueue = process => {
  const [{ isProcessing, queue }, dispatch] = useReducer(reducer, initialState);

  function add(payload) {
    dispatch({
      type: actions.ADD,
      payload,
    });
  }

  useEffect(() => {
    if (typeof process !== 'function') {
      return;
    }

    if (queue.length > 0 && !isProcessing) {
      dispatch({
        type: actions.PROCESSING,
      });
      process(queue[0], () => {
        dispatch({
          type: actions.PROCESSED,
        });
      });
    }
  }, [queue, isProcessing, process]);

  return [add, queue];
};

function reducer(state, action) {
  switch (action.type) {
    case actions.ADD:
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };

    case actions.PROCESSING:
      return {
        ...state,
        isProcessing: true,
      };

    case actions.PROCESSED:
      return {
        isProcessing: false,
        queue: state.queue.slice(1),
      };

    default:
      return state;
  }
}
