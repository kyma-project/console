import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Spinner,
  Panel,
  PanelBody,
} from '@kyma-project/react-components';

import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from './ServiceClassInfo/ServiceClassInfo.component';
import ServiceClassDescription from './ServiceClassDescription/ServiceClassDescription.component';
import ProvisionOnlyOnceInfo from './ProvisionOnlyOnceInfo/ProvisionOnlyOnceInfo.component';
import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import { isStringValueEqualToTrue } from '../../commons/helpers';

import {
  ServiceClassDetailsWrapper,
  ServiceGridWrapper,
  LeftSideWrapper,
  CenterSideWrapper,
  EmptyList,
} from './styled';

import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from '../../commons/helpers';

class ServiceClassDetails extends React.Component {
  static propTypes = {
    serviceClass: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
  };

  render() {
    const { history, createServiceInstance } = this.props;
    const serviceClass =
      this.props.serviceClass.clusterServiceClass ||
      this.props.serviceClass.serviceClass;

    const serviceClassDisplayName = getResourceDisplayName(serviceClass);

    const serviceClassDescription = getDescription(serviceClass);

    const isProvisionedOnlyOnce =
      serviceClass &&
      serviceClass.labels &&
      serviceClass.labels.provisionOnlyOnce &&
      isStringValueEqualToTrue(serviceClass.labels.provisionOnlyOnce);

    const buttonText = {
      provisionOnlyOnce: 'Add once',
      provisionOnlyOnceActive: 'Added once',
      standard: 'Add',
    };
    const noClassText = "Such a Service Class doesn't exist in this Namespace";

    const modalOpeningComponent = (
      <Button
        option="emphasized"
        data-e2e-id="add-to-env"
        disabled={Boolean(isProvisionedOnlyOnce && serviceClass.activated)}
      >
        {isProvisionedOnlyOnce
          ? serviceClass.activated
            ? buttonText.provisionOnlyOnceActive
            : buttonText.provisionOnlyOnce
          : buttonText.standard}
      </Button>
    );

    if (this.props.serviceClass.loading) {
      return (
        <EmptyList>
          <Spinner />
        </EmptyList>
      );
    }
    if (!this.props.serviceClass.loading && !serviceClass) {
      return (
        <EmptyList>
          <Panel>
            <PanelBody>{noClassText}</PanelBody>
          </Panel>
        </EmptyList>
      );
    }

    return (
      <div>
        {serviceClass && (
          <div>
            <div> {this.arrayOfJsx} </div>
            {this.renObjData}
            <ServiceClassToolbar
              history={history}
              serviceClassDisplayName={serviceClassDisplayName}
            >
              <CreateInstanceModal
                serviceClass={serviceClass}
                modalOpeningComponent={modalOpeningComponent}
                createServiceInstance={createServiceInstance}
              />
            </ServiceClassToolbar>

            <ServiceClassDetailsWrapper phoneRows>
              <LeftSideWrapper>
                <ServiceClassInfo
                  serviceClassDisplayName={serviceClassDisplayName}
                  providerDisplayName={serviceClass.providerDisplayName}
                  creationTimestamp={serviceClass.creationTimestamp}
                  documentationUrl={serviceClass.documentationUrl}
                  supportUrl={serviceClass.supportUrl}
                  imageUrl={serviceClass.imageUrl}
                  tags={serviceClass.tags}
                  labels={serviceClass.labels}
                />
              </LeftSideWrapper>
              <CenterSideWrapper>
                <ServiceGridWrapper cols={isProvisionedOnlyOnce ? 4 : 1}>
                  {serviceClassDescription && (
                    <ServiceClassDescription
                      description={serviceClassDescription}
                    />
                  )}
                  {isProvisionedOnlyOnce && <ProvisionOnlyOnceInfo />}
                </ServiceGridWrapper>
                {backendModuleExists('content') ? (
                  <ServiceClassTabs
                    serviceClass={serviceClass}
                    serviceClassLoading={this.props.serviceClass.loading}
                  />
                ) : null}
              </CenterSideWrapper>
            </ServiceClassDetailsWrapper>
          </div>
        )}
      </div>
    );
  }
}

export default ServiceClassDetails;
