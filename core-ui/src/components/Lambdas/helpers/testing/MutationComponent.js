import React from 'react';

import { BUTTON_TEST_ID } from './constants';

export function MutationComponent({
  hook,
  hookInput,
  mutationInput,
  userCallback = () => void 0,
}) {
  const mutateAction = hook(hookInput);
  const isFunction = elem => typeof elem === 'function';
  const mutateActionFunction = Array.isArray(mutateAction)
    ? mutateAction.find(isFunction)
    : mutateAction;
  return (
    <button
      data-testid={BUTTON_TEST_ID}
      onClick={() => mutateActionFunction(mutationInput, userCallback)}
    >
      Action!
    </button>
  );
}
