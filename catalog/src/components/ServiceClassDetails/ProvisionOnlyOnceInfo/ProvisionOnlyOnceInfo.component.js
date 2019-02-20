import React from 'react';

import { Icon, PanelActions } from '@kyma-project/react-components';

import {
  Element,
  ProvisionOnlyOnceInfoContentWrapper,
  ContentHeader,
  ContentDescription,
} from './styled';

const ProvisionOnlyOnceInfo = () => {
  const noteText = {
    title: 'Note',
    description:
      'This Service Class can be provisioned only once in a given namespace.',
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
      <ContentDescription>
        <Element margin="0" data-e2e-id="instance-status-type">
          {noteText.description}
        </Element>
      </ContentDescription>
    </ProvisionOnlyOnceInfoContentWrapper>
  );
};

export default ProvisionOnlyOnceInfo;
