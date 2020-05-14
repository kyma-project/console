import React from 'react';

import { Icon, PanelActions } from '@kyma-project/react-components';

import {
  ProvisionOnlyOnceInfoContentWrapper,
  ContentHeader,
  ContentDescription,
} from './styled';

const ProvisionOnlyOnceInfo = () => {
  const noteText = {
    title: 'Note',
    description:
      'You can provision this Service Class only once in a given Namespace.',
  };
  return (
    <ProvisionOnlyOnceInfoContentWrapper
      colSpan={1}
      color="#0b74de"
      data-e2e-id="provision-only-once-info"
    >
      <ContentHeader>
        {noteText.title}
        <PanelActions>
          <Icon glyph="message-information" style={{ color: '#0b74de' }} />
        </PanelActions>
      </ContentHeader>
      <ContentDescription data-e2e-id="instance-status-type">
        {noteText.description}
      </ContentDescription>
    </ProvisionOnlyOnceInfoContentWrapper>
  );
};

export default ProvisionOnlyOnceInfo;
