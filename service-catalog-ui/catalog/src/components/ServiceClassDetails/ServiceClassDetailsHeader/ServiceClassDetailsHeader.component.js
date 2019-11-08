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
  typename,
}) => {
  const goToServiceDetailsList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .withParams({
        selectedTab: typename === 'ServiceClass' ? 'services' : 'addons',
      })
      .navigate('/');
  };
  return (
    <HeaderWrapper>
      <BreadcrumbWrapper>
        <Breadcrumb>
          <Breadcrumb.Item
            name={`${serviceClassConstants.title} - ${
              typename === 'ServiceClass' ? 'Services' : 'Add-Ons'
            }`}
            url="#"
            onClick={goToServiceDetailsList}
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
  typename: PropTypes.string,
};

export default ServiceClassDetailsHeader;
