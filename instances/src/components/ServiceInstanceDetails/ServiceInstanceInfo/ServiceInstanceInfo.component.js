import React from 'react';
import Grid from 'styled-components-grid';
import LuigiClient from '@kyma-project/luigi-client';

import {
  Label,
  Icon,
  instanceStatusColor,
  Modal,
  PanelActions,
} from '@kyma-project/react-components';

import {
  ServiceInstanceInfoWrapper,
  CenterSideWrapper,
  ContentHeader,
  ContentDescription,
  Element,
  PlanModalButton,
  ServiceClassButton,
  LabelWrapper,
  ExternalLink,
  JSONCode,
} from './styled';

import { getResourceDisplayName } from '../../../commons/helpers';

const INFORMATION_KEY_SIZE = { mobile: 1, tablet: 0.5, desktop: 0.3 };
const INFORMATION_VALUE_SIZE = { mobile: 1, tablet: 0.5, desktop: 0.7 };

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
    <ServiceInstanceInfoWrapper cols={3}>
      <CenterSideWrapper colSpan={2}>
        <ContentDescription>
          <Grid>
            <Grid.Unit size={INFORMATION_KEY_SIZE}>
              <Element margin="0">Service Class</Element>
            </Grid.Unit>
            <Grid.Unit size={INFORMATION_VALUE_SIZE}>
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
            <Grid.Unit size={INFORMATION_KEY_SIZE}>
              <Element>Plan</Element>
            </Grid.Unit>
            <Grid.Unit size={INFORMATION_VALUE_SIZE}>
              <Element data-e2e-id="instance-service-plan">
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
          {serviceInstance.labels && serviceInstance.labels.length > 0 && (
            <Grid>
              <Grid.Unit size={INFORMATION_KEY_SIZE}>
                <Element>Labels</Element>
              </Grid.Unit>
              <Grid.Unit size={INFORMATION_VALUE_SIZE}>
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
              </Grid.Unit>
            </Grid>
          )}
          {instanceClass && instanceClass.documentationUrl ? (
            <Grid>
              <Grid.Unit size={INFORMATION_KEY_SIZE}>
                <Element
                  margin={
                    serviceInstance.labels && serviceInstance.labels.length > 0
                      ? '11px 0 0 0'
                      : '16px 0 0 0'
                  }
                >
                  Documentation
                </Element>
              </Grid.Unit>
              <Grid.Unit size={INFORMATION_VALUE_SIZE}>
                <Element
                  margin={
                    serviceInstance.labels && serviceInstance.labels.length > 0
                      ? '11px 0 0 0'
                      : '16px 0 0 0'
                  }
                >
                  <ExternalLink
                    href={instanceClass.documentationUrl}
                    target="_blank"
                    data-e2e-id="instance-service-documentation-link"
                  >
                    Link
                  </ExternalLink>
                </Element>
              </Grid.Unit>
            </Grid>
          ) : null}
          {instanceClass && instanceClass.supportUrl ? (
            <Grid>
              <Grid.Unit size={INFORMATION_KEY_SIZE}>
                <Element>Support</Element>
              </Grid.Unit>
              <Grid.Unit size={INFORMATION_VALUE_SIZE}>
                <Element>
                  <ExternalLink
                    href={instanceClass.supportUrl}
                    target="_blank"
                    data-e2e-id="instance-service-support-link"
                  >
                    Link
                  </ExternalLink>
                </Element>
              </Grid.Unit>
            </Grid>
          ) : null}
        </ContentDescription>
      </CenterSideWrapper>
      <CenterSideWrapper
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

        <ContentDescription>
          <Element margin="0" data-e2e-id="instance-status-type">
            {serviceInstance.status.type}
          </Element>
          <Element
            style={{ padding: '0' }}
            data-e2e-id="instance-status-message"
          >
            {serviceInstance.status.message}
          </Element>
        </ContentDescription>
      </CenterSideWrapper>
    </ServiceInstanceInfoWrapper>
  );
};

export default ServiceInstanceInfo;
