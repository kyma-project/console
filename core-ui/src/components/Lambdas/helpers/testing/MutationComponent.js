import React from 'react';

import { BUTTON_TEST_ID } from './constants';

export function MutationComponent({ hook, hookInput, mutationInput }) {
  const mutateAction = hook(hookInput);

  return (
    <button
      data-testid={BUTTON_TEST_ID}
      onClick={() => mutateAction(mutationInput)}
    >
      Action!
    </button>
  );
}
