import React from 'react';

import { TESTING_STATE } from './constants';

export function QueryComponent({ hook, hookInput, dataProp = 'data' }) {
  const hookData = hook(hookInput);

  let data, error, loading;
  if (Array.isArray(hookData)) {
    [data, error, loading] = hookData;
  } else {
    data = hookData[dataProp];
    error = hookData.error;
    loading = hookData.loading;
  }

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
