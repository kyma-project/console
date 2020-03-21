import React from 'react';

import { TESTING_STATE } from './constants';

export function QueryComponent({ hook, hookInput }) {
  const [data, error, loading] = hook(hookInput);

  if (loading) {
    return <p>{TESTING_STATE.LOADING}</p>;
  }
  if (error) {
    return <p>{TESTING_STATE.ERROR}</p>;
  }
  if (data) {
    return <p>{TESTING_STATE.DATA}</p>;
  }
  return <p>{TESTING_STATE.EMPTY_DATA}</p>;
}
