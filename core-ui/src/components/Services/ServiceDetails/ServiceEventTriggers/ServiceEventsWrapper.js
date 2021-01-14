import React from 'react';
import { useConfig } from 'react-shared';

import { createServiceRef } from './helpers';

import BebEventSubscription from 'shared/components/EventSubscriptions/BebEventSubscription';
import ServiceEventTriggers from './ServiceEventTriggers';

export default function ServiceEventsWrapper({ service }) {
  const { fromConfig } = useConfig();

  if (fromConfig('bebEnabled') === 'true') {
    return (
      <BebEventSubscription
        resource={service}
        createResourceRef={createServiceRef}
      />
    );
  } else {
    return <ServiceEventTriggers service={service} />;
  }
}
