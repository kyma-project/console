import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb } from '@kyma-project/react-components';

import ServiceClassToolbar from '../ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from '../ServiceClassInfo/ServiceClassInfo.component';

import {
  BreadcrumbWrapper,
  ServiceClassToolbarWrapper,
  HeaderWrapper,
} from './styled';

import { serviceClassConstants } from '../../../variables';
import { isService } from '../../../commons/helpers';

const ServiceClassDetailsHeader = ({
  creationTimestamp,
  description,
  documentationUrl,
  imageUrl,
  isProvisionedOnlyOnce,
  labels,
  providerDisplayName,
  serviceClassDisplayName,
  supportUrl,
  tags,
  children,
}) => {
  const goToList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .withParams({
        selectedTab: isService({ labels }) ? 'services' : 'addons',
      })
      .navigate('/');
  };
  return (
    <HeaderWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb>
          <Breadcrumb.Item
            name={`${serviceClassConstants.title} - ${
              isService({ labels }) ? 'Services' : 'Add-Ons'
            }`}
            url="#"
            onClick={goToList}
          />
          <Breadcrumb.Item />
        </Breadcrumb>
      </BreadcrumbWrapper>
      <ServiceClassToolbarWrapper>
        <ServiceClassToolbar
          serviceClassDisplayName={serviceClassDisplayName}
          providerDisplayName={providerDisplayName}
        >
          {children}
        </ServiceClassToolbar>
      </ServiceClassToolbarWrapper>
      <ServiceClassInfo
        creationTimestamp={creationTimestamp}
        description={description}
        documentationUrl={documentationUrl}
        imageUrl={imageUrl}
        isProvisionedOnlyOnce={isProvisionedOnlyOnce}
        labels={labels}
        providerDisplayName={providerDisplayName}
        supportUrl={supportUrl}
        tags={tags}
      />
    </HeaderWrapper>
  );
};

ServiceClassDetailsHeader.propTypes = {
  creationTimestamp: PropTypes.number.isRequired,
  description: PropTypes.string,
  serviceClassDisplayName: PropTypes.string.isRequired,
  providerDisplayName: PropTypes.string,
  children: PropTypes.element,
  labels: PropTypes.object,
  tags: PropTypes.array,
  documentationUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  supportUrl: PropTypes.string,
};

export default ServiceClassDetailsHeader;
