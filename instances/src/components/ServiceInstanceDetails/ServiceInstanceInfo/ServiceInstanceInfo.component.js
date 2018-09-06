import React from 'react';
import Grid from 'styled-components-grid';

import {
  Icon,
  Header,
  Separator,
  InformationModal,
} from '@kyma-project/react-components';

import {
  ServiceInstanceInfoWrapper,
  StretchedContentWrapper,
  CenterSideWrapper,
  ContentHeader,
  ContentDescription,
  Element,
  InfoIcon,
  PlanModalButton,
  Label,
  ExternalLink,
  JSONCode,
} from './styled';

import { getResourceDisplayName, statusColor } from '../../../commons/helpers';

const ServiceInstanceInfo = ({ serviceInstance }) => {
  const statusIcon = statusType => {
    switch (statusType) {
      case ('PROVISIONING', 'DEPROVISIONING', 'PENDING'):
        return '\uE1C4';
      case 'FAILED':
        return '\uE0B1';
      case 'RUNNING':
        return '\uE1C2';
      default:
        return '\uE1C4';
    }
  };

  return (
    <ServiceInstanceInfoWrapper>
      <Grid.Unit size={0.7}>
        <CenterSideWrapper margin={'left'}>
          <StretchedContentWrapper>
            <ContentHeader>
              <Header>General Information</Header>
            </ContentHeader>
            <Separator />
            <ContentDescription>
              <Grid>
                <Grid.Unit size={0.2}>
                  <Element margin="0">Service Class</Element>
                </Grid.Unit>
                <Grid.Unit size={0.8}>
                  <Element margin="0" data-e2e-id="instance-service-class">
                    {serviceInstance.serviceClass
                      ? getResourceDisplayName(serviceInstance.serviceClass)
                      : '-'}
                  </Element>
                </Grid.Unit>
                <Grid.Unit size={0.2}>
                  <Element>Plan</Element>
                </Grid.Unit>
                <Grid.Unit size={0.8}>
                  <Element>
                    {serviceInstance.servicePlanSpec &&
                    Object.keys(serviceInstance.servicePlanSpec).length ? (
                      <InformationModal
                        modalOpeningComponent={
                          <PlanModalButton data-e2e-id="instance-service-plan">
                            {`${getResourceDisplayName(
                              serviceInstance.servicePlan,
                            )} plan`}
                          </PlanModalButton>
                        }
                        title="Instance Parameters"
                        content={
                          <JSONCode>
                            {JSON.stringify(
                              serviceInstance.servicePlanSpec,
                              undefined,
                              2,
                            )}
                          </JSONCode>
                        }
                      />
                    ) : (
                      `${getResourceDisplayName(
                        serviceInstance.servicePlan,
                      )} plan`
                    )}
                  </Element>
                </Grid.Unit>
              </Grid>
              {serviceInstance.labels &&
                serviceInstance.labels.length > 0 && (
                  <Grid>
                    <Grid.Unit size={0.2}>
                      <Element>Labels</Element>
                    </Grid.Unit>
                    <Grid.Unit size={0.8}>
                      <Element margin="1px 0 0 0">
                        {serviceInstance.labels.map(label => (
                          <Label key={label}>{label}</Label>
                        ))}
                      </Element>
                    </Grid.Unit>
                  </Grid>
                )}
              {serviceInstance.serviceClass &&
                (serviceInstance.serviceClass.documentationUrl ||
                  serviceInstance.serviceClass.supportUrl) && (
                  <Grid>
                    <Grid.Unit size={0.2}>
                      <Element margin="11px 0 0 0">Documentations</Element>
                    </Grid.Unit>
                    <Grid.Unit size={0.8}>
                      <Element margin="11px 0 0 0">
                        {serviceInstance.serviceClass.documentationUrl && (
                          <ExternalLink
                            href={serviceInstance.serviceClass.documentationUrl}
                            target="_blank"
                            data-e2e-id="instance-service-documentation-link"
                          >
                            Documentation
                          </ExternalLink>
                        )}
                        {serviceInstance.serviceClass.supportUrl ? ', ' : ''}
                        {serviceInstance.serviceClass.supportUrl && (
                          <ExternalLink
                            href={serviceInstance.serviceClass.supportUrl}
                            target="_blank"
                            data-e2e-id="instance-service-support-link"
                          >
                            Support
                          </ExternalLink>
                        )}
                      </Element>
                    </Grid.Unit>
                  </Grid>
                )}
            </ContentDescription>
          </StretchedContentWrapper>
        </CenterSideWrapper>
      </Grid.Unit>
      <Grid.Unit size={0.3}>
        <CenterSideWrapper>
          <StretchedContentWrapper
            color={statusColor(serviceInstance.status.type)}
          >
            <ContentHeader>
              <Grid>
                <Grid.Unit size={0.9}>
                  <Header>Status</Header>
                </Grid.Unit>
                <Grid.Unit size={0.1}>
                  <InfoIcon color={statusColor(serviceInstance.status.type)}>
                    <Icon icon={statusIcon(serviceInstance.status.type)} />
                  </InfoIcon>
                </Grid.Unit>
              </Grid>
            </ContentHeader>
            <Separator />
            <ContentDescription>
              <Element data-e2e-id="instance-status-type">
                {serviceInstance.status.type}
              </Element>
              <Element
                style={{ padding: '0' }}
                data-e2e-id="instance-status-message"
              >
                {serviceInstance.status.message}
              </Element>
            </ContentDescription>
          </StretchedContentWrapper>
        </CenterSideWrapper>
      </Grid.Unit>
    </ServiceInstanceInfoWrapper>
  );
};

export default ServiceInstanceInfo;
