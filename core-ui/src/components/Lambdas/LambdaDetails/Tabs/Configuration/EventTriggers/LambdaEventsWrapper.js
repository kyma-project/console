import React from 'react';
import { useConfig } from 'react-shared';

import BebLambdaEventSubscription from './BebLambdaEventSubscription';
import LambdaEventTriggers from './EventTriggersWrapper';

export default function LambdaEventsWrapper({ lambda }) {
  const { fromConfig } = useConfig();

  if (fromConfig('bebEnabled')) {
    return <BebLambdaEventSubscription lambda={lambda} />;
  } else {
    return <LambdaEventTriggers lambda={lambda} />;
  }
}
