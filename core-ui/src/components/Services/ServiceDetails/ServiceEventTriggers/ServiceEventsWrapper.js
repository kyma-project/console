import React from 'react';
import { useMicrofrontendContext } from 'react-shared';

import { createServiceRef } from './helpers';

import BebEventSubscription from 'shared/components/EventSubscriptions/BebEventSubscription';
import ServiceEventTriggers from './ServiceEventTriggers';

export default function ServiceEventsWrapper({ service }) {
  const { bebEnabled } = useMicrofrontendContext();

  if (bebEnabled) {
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
