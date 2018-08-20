import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@kyma-project/react-components';

import ServiceClassToolbar from './ServiceClassToolbar/ServiceClassToolbar.component';
import ServiceClassInfo from './ServiceClassInfo/ServiceClassInfo.component';
import ServiceClassDescription from './ServiceClassDescription/ServiceClassDescription.component';
import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs.component';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';

import {
  ServiceClassDetailsWrapper,
  LeftSideWrapper,
  CenterSideWrapper,
} from './styled';

import { getResourceDisplayName } from '../../commons/helpers';

class ServiceClassDetails extends React.Component {
  static propTypes = {
    serviceClass: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    createServiceInstance: PropTypes.func.isRequired,
  };

  render() {
    const { serviceClass, history, createServiceInstance } = this.props;

    const serviceClassDisplayName = getResourceDisplayName(
      serviceClass.serviceClass,
    );

    const modalOpeningComponent = (
      <Button normal primary first last microFullWidth data-e2e-id="add-to-env">
        Add to your Environment
      </Button>
    );

    return (
      <div>
        {serviceClass.serviceClass && (
          <div>
            <div> {this.arrayOfJsx} </div>
            {this.renObjData}
            <ServiceClassToolbar
              arrayOfJsx={this.arrayOfJsx}
              renObjData={this.renObjData}
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
                  providerDisplayName={
                    serviceClass.serviceClass.providerDisplayName
                  }
                  creationTimestamp={
                    serviceClass.serviceClass.creationTimestamp
                  }
                  documentationUrl={serviceClass.serviceClass.documentationUrl}
                />
              </LeftSideWrapper>
              <CenterSideWrapper>
                {serviceClass.serviceClass.description && (
                  <ServiceClassDescription
                    description={serviceClass.serviceClass.description}
                  />
                )}
                {serviceClass.serviceClass.content ||
                serviceClass.serviceClass.apiSpec ||
                serviceClass.serviceClass.asyncApiSpec ? (
                  <ServiceClassTabs serviceClass={serviceClass} />
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
