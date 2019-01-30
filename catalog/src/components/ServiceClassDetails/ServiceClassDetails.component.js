import React from 'react';
import PropTypes from 'prop-types';

import { Button, Spinner } from '@kyma-project/react-components';

import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from './ServiceClassInfo/ServiceClassInfo.component';
import ServiceClassDescription from './ServiceClassDescription/ServiceClassDescription.component';
import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import {
  ServiceClassDetailsWrapper,
  LeftSideWrapper,
  CenterSideWrapper,
  EmptyList,
} from './styled';

import { getResourceDisplayName, getDescription } from '../../commons/helpers';

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

    const modalOpeningComponent = (
      <Button option="emphasized" data-e2e-id="add-to-env">
        Add to your Namespace
      </Button>
    );

    if (this.props.serviceClass.loading) {
      return (
        <EmptyList>
          <Spinner size="40px" color="#32363a" />
        </EmptyList>
      );
    }
    if (!this.props.serviceClass.loading && !serviceClass) {
      return (
        <EmptyList>Service Class doesn't exist in this namespace</EmptyList>
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
                {serviceClassDescription && (
                  <ServiceClassDescription
                    description={serviceClassDescription}
                  />
                )}
                <ServiceClassTabs
                  serviceClass={serviceClass}
                  serviceClassLoading={this.props.serviceClass.loading}
                />
              </CenterSideWrapper>
            </ServiceClassDetailsWrapper>
          </div>
        )}
      </div>
    );
  }
}

export default ServiceClassDetails;
