import React from 'react';
import { useMicrofrontendContext } from 'react-shared';

import { createLambdaRef } from './helpers';

import BebEventSubscription from 'shared/components/EventSubscriptions/BebEventSubscription';
import LambdaEventTriggers from './EventTriggersWrapper';

export default function LambdaEventsWrapper({ lambda }) {
  const { bebEnabled } = useMicrofrontendContext();

  if (bebEnabled) {
    return (
      <BebEventSubscription
        resource={lambda}
        createResourceRef={createLambdaRef}
      />
    );
  } else {
    return <LambdaEventTriggers lambda={lambda} />;
  }
}
