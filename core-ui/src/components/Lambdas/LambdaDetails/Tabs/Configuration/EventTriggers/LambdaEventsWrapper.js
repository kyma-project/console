import React from 'react';
import { useConfig } from 'react-shared';

import { createLambdaRef } from './helpers';

import BebEventSubscription from 'shared/components/EventSubscriptions/BebEventSubscription';
import LambdaEventTriggers from './EventTriggersWrapper';

export default function LambdaEventsWrapper({ lambda }) {
  const { fromConfig } = useConfig();

  if (fromConfig('bebEnabled') === 'true') {
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
