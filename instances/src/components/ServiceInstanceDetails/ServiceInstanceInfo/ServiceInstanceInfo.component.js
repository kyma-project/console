import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  Icon,
  instanceStatusColor,
  Modal,
  PanelBody,
  PanelActions,
  Label,
} from '@kyma-project/react-components';

import {
  ServiceInstanceInfoWrapper,
  ContentHeader,
  ContentDescription,
  Element,
  PlanModalButton,
  ServiceClassButton,
  ExternalLink,
  JSONCode,
  DescriptionKey,
  DescriptionGrid,
  DescriptionWrapper,
  StatusWrapper,
  ServiceInstanceDescription,
  GridCell,
  LabelWrapper,
} from './styled';

import { getResourceDisplayName } from '../../../commons/helpers';

const INFORMATION_CELL_SIZE = { mobile: 1, tablet: 0.5, desktop: 0.5 };

const ServiceInstanceInfo = ({ serviceInstance }) => {
  const statusIcon = statusType => {
    switch (statusType) {
      case ('PROVISIONING', 'DEPROVISIONING', 'PENDING'):
        return 'sys-help';
      case 'FAILED':
        return 'sys-cancel';
      case 'RUNNING':
        return 'sys-enter';
      default:
        return 'sys-help';
    }
  };

  const goToServiceClassDetails = name => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-service-catalog/details/${name}`);
  };

  if (!serviceInstance) {
    return null;
  }

  serviceInstance.labels = ['hey', 'ho', 'kawal dobrej labelki'];

  const instanceClass = serviceInstance.clusterServiceClass
    ? serviceInstance.clusterServiceClass
    : serviceInstance.serviceClass;
  const instancePlan = serviceInstance.clusterServicePlan
    ? serviceInstance.clusterServicePlan
    : serviceInstance.servicePlan;

  return (
    <ServiceInstanceInfoWrapper cols={3}>
      <DescriptionWrapper colSpan={2}>
        <ServiceInstanceDescription>
          {instanceClass && instanceClass.description}
        </ServiceInstanceDescription>
        <ContentDescription>
          <DescriptionGrid>
            <GridCell size={INFORMATION_CELL_SIZE}>
              <DescriptionKey>Service Class</DescriptionKey>
              <Element margin="0" data-e2e-id="instance-service-class">
                {instanceClass && instanceClass.name ? (
                  <ServiceClassButton
                    onClick={() => goToServiceClassDetails(instanceClass.name)}
                  >
                    {getResourceDisplayName(instanceClass)}
                  </ServiceClassButton>
                ) : (
                  '-'
                )}
              </Element>
            </GridCell>
            <GridCell size={INFORMATION_CELL_SIZE}>
              <DescriptionKey>Plan</DescriptionKey>
              <Element margin="0" data-e2e-id="instance-service-plan">
                {serviceInstance.planSpec &&
                serviceInstance.planSpec !== null &&
                typeof serviceInstance.planSpec === 'object' &&
                Object.keys(serviceInstance.planSpec).length ? (
                  <Modal
                    modalOpeningComponent={
                      <PlanModalButton>
                        {getResourceDisplayName(instancePlan)}
                      </PlanModalButton>
                    }
                    title="Instance Parameters"
                    onShow={() => LuigiClient.uxManager().addBackdrop()}
                    onHide={() => LuigiClient.uxManager().removeBackdrop()}
                  >
                    <JSONCode>
                      {JSON.stringify(serviceInstance.planSpec, undefined, 2)}
                    </JSONCode>
                  </Modal>
                ) : (
                  `${getResourceDisplayName(instancePlan) || '-'}`
                )}
              </Element>
            </GridCell>
          </DescriptionGrid>
          <DescriptionGrid>
            {instanceClass && instanceClass.documentationUrl ? (
              <GridCell size={INFORMATION_CELL_SIZE}>
                <DescriptionKey>Documentation</DescriptionKey>
                <Element margin="0">
                  <ExternalLink
                    href={instanceClass.documentationUrl}
                    target="_blank"
                    data-e2e-id="instance-service-documentation-link"
                  >
                    Link
                  </ExternalLink>
                </Element>
              </GridCell>
            ) : null}

            {instanceClass && instanceClass.supportUrl ? (
              <GridCell size={INFORMATION_CELL_SIZE}>
                <DescriptionKey>Support</DescriptionKey>
                <Element margin="0">
                  <ExternalLink
                    href={instanceClass.supportUrl}
                    target="_blank"
                    data-e2e-id="instance-service-support-link"
                  >
                    Link
                  </ExternalLink>
                </Element>
              </GridCell>
            ) : null}
          </DescriptionGrid>
          <DescriptionGrid>
            {serviceInstance.labels && serviceInstance.labels.length > 0 && (
              <div>
                <DescriptionKey>Labels</DescriptionKey>
                <Element margin="1px 0 0 0">
                  {serviceInstance.labels.map((label, index) => (
                    <LabelWrapper key={`${label}-${index}`}>
                      <Label
                        key={label}
                        cursorType="auto"
                        data-e2e-id="service-label"
                      >
                        {label}
                      </Label>
                    </LabelWrapper>
                  ))}
                </Element>
              </div>
            )}
          </DescriptionGrid>
        </ContentDescription>
      </DescriptionWrapper>
      <StatusWrapper
        colSpan={1}
        color={instanceStatusColor(serviceInstance.status.type)}
      >
        <ContentHeader>
          Status
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
            data-e2e-id="instance-status-type"
            style={{ color: instanceStatusColor(serviceInstance.status.type) }}
          >
            {serviceInstance.status.type}
          </Element>
          <Element
            style={{ padding: '0' }}
            data-e2e-id="instance-status-message"
          >
            {serviceInstance.status.message}
          </Element>
        </PanelBody>
      </StatusWrapper>
    </ServiceInstanceInfoWrapper>
  );
};

export default ServiceInstanceInfo;
