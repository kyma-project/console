import React from 'react';

import { BUTTON_TEST_ID } from './constants';

export function MutationComponent({
  hook,
  hookInput,
  mutationInput,
  userCallback = () => void 0,
}) {
  const mutateAction = hook(hookInput);

  return (
    <button
      data-testid={BUTTON_TEST_ID}
      onClick={() => mutateAction(mutationInput, userCallback)}
    >
      Action!
    </button>
  );
}
