import React from 'react';
import { StatusWrapper, ContentHeader, Element } from './styled';
import {
  Icon,
  instanceStatusColor,
  PanelBody,
  PanelActions,
} from '@kyma-project/react-components';
import { serviceInstanceConstants } from '../../../constants';

const statusIcon = statusType => {
  switch (statusType) {
    case 'FAILED':
      return 'sys-cancel';
    case 'RUNNING':
      return 'sys-enter';
    default:
      return 'sys-help';
  }
};

export const StatusPanel = ({ serviceInstance }) => {
  return (
    <StatusWrapper
      data-e2e-id="instance-status"
      colSpan={1}
      color={instanceStatusColor(serviceInstance.status.type)}
    >
      <ContentHeader>
        {serviceInstanceConstants.statusHeader}
        <PanelActions>
          <Icon
            glyph={statusIcon(serviceInstance.status.type)}
            style={{
              color: instanceStatusColor(serviceInstance.status.type),
            }}
          />
        </PanelActions>
      </ContentHeader>

      <PanelBody>
        <Element
          margin="0"
          style={{ color: instanceStatusColor(serviceInstance.status.type) }}
        >
          {serviceInstance.status.type}
        </Element>
        <Element style={{ padding: '0' }}>
          {serviceInstance.status.message}
        </Element>
      </PanelBody>
    </StatusWrapper>
  );
};
