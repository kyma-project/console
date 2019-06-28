import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import Grid from 'styled-components-grid';
import { getResourceDisplayName } from '../../../commons/helpers';

import {
  Icon,
  instanceStatusColor,
  Modal,
  PanelBody,
  PanelActions,
  Label,
  Panel,
} from '@kyma-project/react-components';

import {
  ServiceInstanceInfoWrapper,
  ContentHeader,
  Element,
  PlanModalButton,
  ServiceClassButton,
  ExternalLink,
  JSONCode,
  DescriptionKey,
  StatusWrapper,
  ServiceInstanceDescription,
  LabelWrapper,
} from './styled';

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

  const instanceClass = serviceInstance.clusterServiceClass
    ? serviceInstance.clusterServiceClass
    : serviceInstance.serviceClass;
  const instancePlan = serviceInstance.clusterServicePlan
    ? serviceInstance.clusterServicePlan
    : serviceInstance.servicePlan;

  return (
    <ServiceInstanceInfoWrapper
      cols={3}
      className="fd-has-padding-bottom-medium"
    >
      <Panel colSpan={2}>
        <ServiceInstanceDescription className="fd-has-margin-bottom-medium">
          {instanceClass && instanceClass.description}
        </ServiceInstanceDescription>
        <PanelBody className="fd-has-margin-bottom-medium fd-has-padding-none">
          <Grid>
            <Grid.Unit size={INFORMATION_CELL_SIZE}>
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
            </Grid.Unit>
            <Grid.Unit size={INFORMATION_CELL_SIZE}>
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
            </Grid.Unit>
          </Grid>
          <Grid>
            {instanceClass && instanceClass.documentationUrl ? (
              <Grid.Unit size={INFORMATION_CELL_SIZE}>
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
              </Grid.Unit>
            ) : null}

            {instanceClass && instanceClass.supportUrl ? (
              <Grid.Unit size={INFORMATION_CELL_SIZE}>
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
              </Grid.Unit>
            ) : null}
          </Grid>
          <Grid>
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
          </Grid>
        </PanelBody>
      </Panel>
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
