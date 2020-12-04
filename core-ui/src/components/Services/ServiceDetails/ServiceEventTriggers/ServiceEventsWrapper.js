import React from 'react';
import { useConfig } from 'react-shared';

import BebServiceEventSubscription from './BebServiceEventSubscription';
import ServiceEventTriggers from './ServiceEventTriggers';

export default function ServiceEventsWrapper({ service }) {
  const { fromConfig } = useConfig();

  if (fromConfig('bebEnabled')) {
    return <BebServiceEventSubscription service={service} />;
  } else {
    return <ServiceEventTriggers service={service} />;
  }
}
