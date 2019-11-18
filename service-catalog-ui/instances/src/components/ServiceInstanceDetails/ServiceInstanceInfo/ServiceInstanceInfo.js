import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import Grid from 'styled-components-grid';
import { getResourceDisplayName } from '../../../commons/helpers';
import { serviceInstanceConstants } from '../../../variables';

import { Modal, PanelBody, Label, Panel } from '@kyma-project/react-components';

import {
  ServiceInstanceInfoWrapper,
  Element,
  PlanModalButton,
  ServiceClassButton,
  ExternalLink,
  JSONCode,
  DescriptionKey,
  LabelWrapper,
} from './styled';
import { StatusPanel } from './StatusPanel';

const INFORMATION_CELL_SIZE = { mobile: 1, tablet: 0.5, desktop: 0.5 };

const ServiceInstanceInfo = ({ serviceInstance }) => {
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
        <PanelBody className="fd-has-margin-bottom-medium fd-has-padding-none">
          <Grid>
            <Grid.Unit size={INFORMATION_CELL_SIZE}>
              <DescriptionKey>
                {serviceInstanceConstants.classHeader}
              </DescriptionKey>
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
              <DescriptionKey>
                {serviceInstanceConstants.planHeader}
              </DescriptionKey>
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
                    title={serviceInstanceConstants.instanceParameters}
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
                <DescriptionKey>
                  {serviceInstanceConstants.documentationHeader}
                </DescriptionKey>
                <Element
                  margin="0"
                  data-e2e-id="instance-service-documentation-link"
                >
                  <ExternalLink
                    href={instanceClass.documentationUrl}
                    target="_blank"
                  >
                    {serviceInstanceConstants.link}
                  </ExternalLink>
                </Element>
              </Grid.Unit>
            ) : null}

            {instanceClass && instanceClass.supportUrl ? (
              <Grid.Unit size={INFORMATION_CELL_SIZE}>
                <DescriptionKey>
                  {serviceInstanceConstants.supportHeader}
                </DescriptionKey>
                <Element margin="0" data-e2e-id="instance-service-support-link">
                  <ExternalLink href={instanceClass.supportUrl} target="_blank">
                    {serviceInstanceConstants.link}
                  </ExternalLink>
                </Element>
              </Grid.Unit>
            ) : null}
          </Grid>
          <Grid>
            {serviceInstance.labels && serviceInstance.labels.length > 0 && (
              <div>
                <DescriptionKey>
                  {serviceInstanceConstants.labelsHeader}
                </DescriptionKey>
                <Element margin="0" data-e2e-id="instance-label">
                  {serviceInstance.labels.map((label, index) => (
                    <LabelWrapper key={`${label}-${index}`}>
                      <Label key={label} cursorType="auto">
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
      <StatusPanel serviceInstance={serviceInstance} />
    </ServiceInstanceInfoWrapper>
  );
};

export default ServiceInstanceInfo;
